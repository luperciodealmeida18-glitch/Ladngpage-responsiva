import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { FileUp, Loader2, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Queries
  const budgetsQuery = trpc.budgets.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const filesQuery = trpc.files.listByBudget.useQuery(
    { budgetId: selectedBudgetId! },
    { enabled: selectedBudgetId !== null && isAuthenticated && user?.role === "admin" }
  );

  // Mutations
  const updateBudgetMutation = trpc.budgets.update.useMutation({
    onSuccess: () => {
      toast.success("Orçamento atualizado com sucesso!");
      budgetsQuery.refetch();
    },
    onError: () => {
      toast.error("Erro ao atualizar orçamento");
    },
  });

  const uploadFileMutation = trpc.files.upload.useMutation({
    onSuccess: () => {
      toast.success("Arquivo enviado com sucesso!");
      filesQuery.refetch();
    },
    onError: () => {
      toast.error("Erro ao enviar arquivo");
    },
  });

  const deleteFileMutation = trpc.files.delete.useMutation({
    onSuccess: () => {
      toast.success("Arquivo deletado com sucesso!");
      filesQuery.refetch();
    },
    onError: () => {
      toast.error("Erro ao deletar arquivo");
    },
  });

  // Verificar permissão
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar o painel administrativo.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleFileUpload = async (budgetId: number, file: File) => {
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      await uploadFileMutation.mutateAsync({
        budgetId,
        fileName: file.name,
        fileBuffer: Buffer.from(buffer),
        mimeType: file.type,
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      approved: "Aprovado",
      rejected: "Rejeitado",
      completed: "Concluído",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerenciar orçamentos e documentos de projetos
          </p>
        </div>

        {budgetsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : budgetsQuery.data && budgetsQuery.data.length > 0 ? (
          <div className="grid gap-6">
            {budgetsQuery.data.map((budget) => (
              <Card key={budget.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{budget.clientName}</CardTitle>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(budget.status)}
                          <span className="text-sm font-medium">
                            {getStatusLabel(budget.status)}
                          </span>
                        </div>
                      </div>
                      <CardDescription>
                        <div className="space-y-1 mt-2">
                          <p>Email: {budget.clientEmail}</p>
                          <p>Telefone: {budget.clientPhone}</p>
                          {budget.message && <p>Mensagem: {budget.message}</p>}
                          <p className="text-xs text-muted-foreground">
                            Criado em: {new Date(budget.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </CardDescription>
                    </div>

                    <Dialog open={selectedBudgetId === budget.id} onOpenChange={(open) => {
                      if (open) setSelectedBudgetId(budget.id);
                      else setSelectedBudgetId(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedBudgetId(budget.id)}>
                          Gerenciar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Gerenciar Orçamento</DialogTitle>
                          <DialogDescription>
                            {budget.clientName} - {budget.clientEmail}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Status e Valor */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Status
                              </label>
                              <select
                                value={budget.status}
                                onChange={(e) => {
                                  updateBudgetMutation.mutate({
                                    id: budget.id,
                                    status: e.target.value as any,
                                  });
                                }}
                                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                              >
                                <option value="pending">Pendente</option>
                                <option value="approved">Aprovado</option>
                                <option value="rejected">Rejeitado</option>
                                <option value="completed">Concluído</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Valor Estimado (R$)
                              </label>
                              <input
                                type="number"
                                value={budget.estimatedValue ? budget.estimatedValue / 100 : ""}
                                onChange={(e) => {
                                  const value = e.target.value ? parseInt(e.target.value) * 100 : undefined;
                                  updateBudgetMutation.mutate({
                                    id: budget.id,
                                    estimatedValue: value,
                                  });
                                }}
                                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          {/* Notas */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Notas
                            </label>
                            <textarea
                              value={budget.notes || ""}
                              onChange={(e) => {
                                updateBudgetMutation.mutate({
                                  id: budget.id,
                                  notes: e.target.value,
                                });
                              }}
                              className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
                              rows={4}
                              placeholder="Adicione notas sobre este orçamento..."
                            />
                          </div>

                          {/* Arquivos */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">Arquivos</h3>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <FileUp className="h-4 w-4 mr-2" />
                                    Upload
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Upload de Arquivo</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleFileUpload(budget.id, file);
                                        }
                                      }}
                                      disabled={uploading}
                                      className="w-full"
                                    />
                                    {uploading && (
                                      <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Enviando...</span>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>

                            {filesQuery.data && filesQuery.data.length > 0 ? (
                              <div className="space-y-2">
                                {filesQuery.data.map((file) => (
                                  <div
                                    key={file.id}
                                    className="flex items-center justify-between p-3 rounded-md border border-input bg-muted/50"
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{file.fileName}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {file.fileSize ? `${(file.fileSize / 1024).toFixed(2)} KB` : "Tamanho desconhecido"}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                      >
                                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                                          Baixar
                                        </a>
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteFileMutation.mutate({ id: file.id })}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Nenhum arquivo enviado
                              </p>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum orçamento solicitado ainda.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
