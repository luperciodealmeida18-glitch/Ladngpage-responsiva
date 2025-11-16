import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { createBudget, getBudgets, getBudgetById, updateBudget, createFile, getFilesByBudgetId, deleteFile } from "./db";
import { storagePut } from "./storage";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Budget management
  budgets: router({
    // Criar novo orçamento (público)
    create: publicProcedure
      .input(z.object({
        clientName: z.string().min(1),
        clientEmail: z.string().email(),
        clientPhone: z.string().min(1),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          await createBudget({
            clientName: input.clientName,
            clientEmail: input.clientEmail,
            clientPhone: input.clientPhone,
            message: input.message,
            status: "pending",
          });
          return { success: true };
        } catch (error) {
          console.error("Error creating budget:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    // Listar todos os orçamentos (apenas admin)
    list: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return getBudgets();
      }),

    // Obter orçamento por ID (apenas admin)
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return getBudgetById(input.id);
      }),

    // Atualizar orçamento (apenas admin)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected", "completed"]).optional(),
        estimatedValue: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        await updateBudget(id, data);
        return { success: true };
      }),
  }),

  // File management
  files: router({
    // Upload de arquivo (apenas admin)
    upload: protectedProcedure
      .input(z.object({
        budgetId: z.number(),
        fileName: z.string(),
        fileBuffer: z.instanceof(Buffer),
        mimeType: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        try {
          // Gerar chave única para o arquivo
          const fileKey = `budgets/${input.budgetId}/files/${Date.now()}-${input.fileName}`;
          
          // Upload para S3
          const { url } = await storagePut(fileKey, input.fileBuffer, input.mimeType);

          // Salvar metadados no banco
          await createFile({
            budgetId: input.budgetId,
            fileName: input.fileName,
            fileKey: fileKey,
            url: url,
            fileSize: input.fileBuffer.length,
            mimeType: input.mimeType,
            uploadedBy: ctx.user?.id || 0,
          });

          return { success: true, url };
        } catch (error) {
          console.error("Error uploading file:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    // Listar arquivos de um orçamento (apenas admin)
    listByBudget: protectedProcedure
      .input(z.object({ budgetId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return getFilesByBudgetId(input.budgetId);
      }),

    // Deletar arquivo (apenas admin)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await deleteFile(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
