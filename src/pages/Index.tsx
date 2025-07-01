
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IndexProps {
  onLogin: () => void;
}

const Index = ({ onLogin }: IndexProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    identifier: "", // WhatsApp or Email
    password: ""
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    birthDate: "",
    gender: "",
    pgmRole: "",
    pgmNumber: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null as File | null,
    participatesFlowUp: false,
    participatesIrmandade: false,
    isAdmin: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Clear localStorage on component mount
  useState(() => {
    localStorage.clear();
  });

  const handleLogin = () => {
    if (!loginForm.identifier.trim() || !loginForm.password) {
      toast({
        title: "Erro",
        description: "Preencha email/WhatsApp e senha.",
        variant: "destructive",
      });
      return;
    }

    // Check if it's admin login
    if (loginForm.identifier === "filipebiten@gmail.com" && loginForm.password === "filipe") {
      const adminUser = {
        id: "admin",
        name: "Filipe Biten",
        email: "filipebiten@gmail.com",
        whatsapp: "",
        birthDate: "1990-01-01",
        gender: "Masculino",
        pgmRole: "Pastor de Rede",
        pgmNumber: "",
        isAdmin: true,
        phase: "Oceano",
        points: 1500,
        profilePhoto: null,
        joinDate: new Date().toISOString(),
        booksRead: [],
        coursesCompleted: [],
        coursesInProgress: [],
        participatesFlowUp: false,
        participatesIrmandade: false,
        badges: [],
        consecutiveDays: 200,
        role: 'admin'
      };

      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      localStorage.setItem('users', JSON.stringify([adminUser]));
      onLogin();
      navigate('/feed');
      return;
    }

    // Check existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => 
      (u.email === loginForm.identifier || u.whatsapp === loginForm.identifier) && 
      u.password === loginForm.password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLogin();
      navigate('/feed');
      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta, ${user.name}!`,
      });
    } else {
      toast({
        title: "Erro",
        description: "Credenciais inválidas.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = () => {
    if (!registerForm.name.trim() || !registerForm.email.trim() || !registerForm.whatsapp.trim() || 
        !registerForm.birthDate || !registerForm.gender || !registerForm.pgmRole || !registerForm.password) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if ((registerForm.pgmRole === "Participante" || registerForm.pgmRole === "Líder") && !registerForm.pgmNumber.trim()) {
      toast({
        title: "Erro",
        description: "Número do PGM é obrigatório para participantes e líderes.",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "Senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: any) => u.email === registerForm.email || u.whatsapp === registerForm.whatsapp);
    
    if (userExists) {
      toast({
        title: "Erro",
        description: "Usuário já existe.",
        variant: "destructive",
      });
      return;
    }

    // Calculate age for Flow Up eligibility
    const birthDate = new Date(registerForm.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const newUser = {
      id: Date.now().toString(),
      name: registerForm.name,
      email: registerForm.email,
      whatsapp: registerForm.whatsapp,
      birthDate: registerForm.birthDate,
      gender: registerForm.gender,
      pgmRole: registerForm.pgmRole,
      pgmNumber: registerForm.pgmNumber,
      password: registerForm.password,
      isAdmin: registerForm.isAdmin,
      phase: "Riacho",
      points: 0,
      profilePhoto: previewUrl,
      joinDate: new Date().toISOString(),
      booksRead: [],
      coursesCompleted: [],
      coursesInProgress: [],
      participatesFlowUp: age >= 25 ? registerForm.participatesFlowUp : false,
      participatesIrmandade: registerForm.gender === "Masculino" ? registerForm.participatesIrmandade : false,
      badges: [],
      consecutiveDays: 0,
      role: registerForm.isAdmin ? 'admin' : 'user'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    onLogin();
    navigate('/feed');
    toast({
      title: "Cadastro realizado!",
      description: `Bem-vindo à REDE FLOW, ${newUser.name}!`,
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRegisterForm(prev => ({ ...prev, profilePhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const showFlowUpOption = registerForm.birthDate && calculateAge(registerForm.birthDate) >= 25;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.2),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.05)_50%,transparent_60%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                REDE FLOW
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                POSTURA | IDENTIDADE | OBEDIÊNCIA
              </p>
              <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-700">Este app está em fase de testes.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email ou WhatsApp</Label>
                  <Input
                    id="identifier"
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, identifier: e.target.value }))}
                    placeholder="Digite seu email ou WhatsApp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Digite sua senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button onClick={handleLogin} className="w-full bg-teal-600 hover:bg-teal-700">
                  Entrar
                </Button>

                <Button variant="link" className="w-full text-sm text-gray-600">
                  Esqueci minha senha
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Digite seu email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    value={registerForm.whatsapp}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="Digite seu WhatsApp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={registerForm.birthDate}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>

                {showFlowUpOption && (
                  <div className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <Checkbox
                      id="flowUp"
                      checked={registerForm.participatesFlowUp}
                      onCheckedChange={(checked) => setRegisterForm(prev => ({ ...prev, participatesFlowUp: !!checked }))}
                    />
                    <Label htmlFor="flowUp" className="text-sm font-medium text-blue-700">Participa do FLOW UP</Label>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero *</Label>
                  <Select
                    value={registerForm.gender}
                    onValueChange={(value) => setRegisterForm(prev => ({ ...prev, gender: value, participatesIrmandade: value === "Masculino" ? prev.participatesIrmandade : false }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {registerForm.gender === "Masculino" && (
                  <div className="flex items-center space-x-2 p-2 bg-purple-50 border border-purple-200 rounded">
                    <Checkbox
                      id="irmandade"
                      checked={registerForm.participatesIrmandade}
                      onCheckedChange={(checked) => setRegisterForm(prev => ({ ...prev, participatesIrmandade: !!checked }))}
                    />
                    <Label htmlFor="irmandade" className="text-sm font-medium text-purple-700">Participa da IRMANDADE</Label>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="pgmRole">Situação no PGM *</Label>
                  <Select
                    value={registerForm.pgmRole}
                    onValueChange={(value) => setRegisterForm(prev => ({ ...prev, pgmRole: value, pgmNumber: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua situação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Participante">Participante</SelectItem>
                      <SelectItem value="Líder">Líder</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Coordenador">Coordenador</SelectItem>
                      <SelectItem value="Pastor de Rede">Pastor de Rede</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(registerForm.pgmRole === "Participante" || registerForm.pgmRole === "Líder") && (
                  <div className="space-y-2">
                    <Label htmlFor="pgmNumber">Número do PGM *</Label>
                    <Input
                      id="pgmNumber"
                      value={registerForm.pgmNumber}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, pgmNumber: e.target.value }))}
                      placeholder="Digite o número do seu PGM"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2 p-2 bg-orange-50 border border-orange-200 rounded">
                  <Checkbox
                    id="isAdmin"
                    checked={registerForm.isAdmin}
                    onCheckedChange={(checked) => setRegisterForm(prev => ({ ...prev, isAdmin: !!checked }))}
                  />
                  <Label htmlFor="isAdmin" className="text-sm font-medium text-orange-700">Sou Administrador</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Foto de Perfil (Opcional)</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={previewUrl} />
                      <AvatarFallback className="bg-teal-100 text-teal-700">
                        <Upload className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="registerPassword"
                      type={showPassword ? "text" : "password"}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Digite sua senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirme sua senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button onClick={handleRegister} className="w-full bg-teal-600 hover:bg-teal-700">
                  Cadastrar
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
