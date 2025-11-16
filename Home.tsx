import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Sun, Zap, Leaf, DollarSign, Shield, Users, Phone, Mail, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBudgetMutation = trpc.budgets.create.useMutation({
    onSuccess: () => {
      toast.success("Orçamento solicitado com sucesso! Entraremos em contato em breve.");
      setFormData({ clientName: "", clientEmail: "", clientPhone: "", message: "" });
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error("Erro ao solicitar orçamento. Tente novamente.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createBudgetMutation.mutateAsync(formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
              <span className="text-xl font-bold text-foreground">Pulse Energia e Conforto</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#sobre" className="text-sm font-medium hover:text-primary transition-colors">Sobre</a>
              <a href="#beneficios" className="text-sm font-medium hover:text-primary transition-colors">Benefícios</a>
              <a href="#servicos" className="text-sm font-medium hover:text-primary transition-colors">Serviços</a>
              <a href="#contato" className="text-sm font-medium hover:text-primary transition-colors">Contato</a>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">Olá, {user?.name}</span>
                  <Button size="sm" variant="outline" onClick={logout}>Sair</Button>
                </>
              ) : (
                <Button asChild>
                  <a href={getLoginUrl()}>Painel Admin</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/hero-solar.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
        </div>
        
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Energia Solar para o Seu <span className="text-primary">Conforto</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Economize até 95% na conta de luz com energia limpa e sustentável. 
              Invista no futuro do planeta e do seu bolso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="#contato">
                  <Zap className="mr-2 h-5 w-5" />
                  Solicitar Orçamento Grátis
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <a href="#beneficios">Saiba Mais</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Quem Somos</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                A <strong>Pulse Energia e Conforto</strong> é especializada em soluções de energia solar fotovoltaica 
                para residências e empresas. Com anos de experiência no mercado, oferecemos sistemas completos 
                de geração de energia limpa e renovável.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Nossa missão é tornar a energia solar acessível a todos, proporcionando economia, 
                sustentabilidade e independência energética. Trabalhamos com equipamentos de alta qualidade 
                e garantia estendida, além de oferecer suporte técnico completo.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Projetos Instalados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Economia Média</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">25 Anos</div>
                  <div className="text-sm text-muted-foreground">Garantia Painéis</div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="/solar-house.jpg" 
                alt="Casa com painéis solares" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section id="beneficios" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por Que Escolher Energia Solar?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra as vantagens de investir em um sistema de energia solar para sua casa ou empresa
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Economia Garantida</CardTitle>
                <CardDescription>
                  Reduza sua conta de luz em até 95% e tenha retorno do investimento em poucos anos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Sustentabilidade</CardTitle>
                <CardDescription>
                  Contribua para um planeta mais limpo com energia 100% renovável e sem emissões
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Sun className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Energia Ilimitada</CardTitle>
                <CardDescription>
                  Aproveite a fonte de energia mais abundante do planeta: o sol brilha todos os dias
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Valorização do Imóvel</CardTitle>
                <CardDescription>
                  Imóveis com energia solar são mais valorizados e atraem compradores conscientes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Independência Energética</CardTitle>
                <CardDescription>
                  Proteja-se contra aumentos nas tarifas de energia e tenha autonomia
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Suporte Completo</CardTitle>
                <CardDescription>
                  Acompanhamento desde o projeto até a instalação, com manutenção e monitoramento
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Soluções completas em energia solar para atender suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/solar-panels.jpg" 
                  alt="Painéis solares residenciais" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Sistemas Residenciais</CardTitle>
                <CardDescription className="text-base">
                  Projetos personalizados para residências de todos os tamanhos. Incluímos análise de consumo, 
                  dimensionamento do sistema, instalação completa e homologação junto à concessionária.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Projeto técnico detalhado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Instalação e homologação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Monitoramento via app</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Garantia estendida</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Sun className="h-24 w-24 text-primary" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Sistemas Comerciais</CardTitle>
                <CardDescription className="text-base">
                  Soluções para empresas que desejam reduzir custos operacionais e demonstrar compromisso 
                  com a sustentabilidade. Projetos de grande porte com financiamento facilitado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Análise de viabilidade econômica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Projetos de grande porte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Financiamento empresarial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Manutenção preventiva</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
              <p className="text-xl text-muted-foreground">
                Solicite um orçamento gratuito e descubra quanto você pode economizar
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                  <CardDescription>
                    Nossa equipe está pronta para atender você
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Telefone</div>
                      <div className="text-muted-foreground">(11) 98765-4321</div>
                      <div className="text-muted-foreground">(11) 3456-7890</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">E-mail</div>
                      <div className="text-muted-foreground">contato@pulseenergia.com.br</div>
                      <div className="text-muted-foreground">vendas@pulseenergia.com.br</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Endereço</div>
                      <div className="text-muted-foreground">
                        Rua das Energias Renováveis, 123<br />
                        São Paulo - SP, 01234-567
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="font-medium mb-2">Horário de Atendimento</div>
                    <div className="text-muted-foreground">
                      Segunda a Sexta: 8h às 18h<br />
                      Sábado: 9h às 13h
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Solicite um Orçamento</CardTitle>
                  <CardDescription>
                    Preencha o formulário e entraremos em contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium mb-2">
                        Nome Completo
                      </label>
                      <input
                        id="nome"
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        E-mail
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="telefone" className="block text-sm font-medium mb-2">
                        Telefone
                      </label>
                      <input
                        id="telefone"
                        type="tel"
                        required
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="(11) 98765-4321"
                      />
                    </div>

                    <div>
                      <label htmlFor="mensagem" className="block text-sm font-medium mb-2">
                        Mensagem
                      </label>
                      <textarea
                        id="mensagem"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        placeholder="Conte-nos sobre seu interesse em energia solar..."
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
                <span className="text-lg font-bold">Pulse Energia e Conforto</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Especialistas em energia solar fotovoltaica. 
                Transformando luz solar em economia e sustentabilidade.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#sobre" className="hover:text-primary transition-colors">Sobre Nós</a></li>
                <li><a href="#beneficios" className="hover:text-primary transition-colors">Benefícios</a></li>
                <li><a href="#servicos" className="hover:text-primary transition-colors">Serviços</a></li>
                <li><a href="#contato" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contato Rápido</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (11) 98765-4321
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  contato@pulseenergia.com.br
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  São Paulo - SP
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Pulse Energia e Conforto. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
