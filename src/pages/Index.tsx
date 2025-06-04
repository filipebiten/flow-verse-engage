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
import { Upload, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
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
    isAdmin: false,
    participatesFlowUp: false,
    participatesIrmandade: false
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
    console.log("Tentativa de login com:", loginForm);
    
    if (!loginForm.identifier.trim() || !loginForm.password) {
      toast({
        title: "Erro",
        description: "Preencha WhatsApp/Email e senha.",
        variant: "destructive",
      });
      return;
    }

    // Check if it's admin login
    if (loginForm.identifier === "filipebiten@gmail.com" && loginForm.password === "filipe") {
      const adminUser = {
        id: "admin",
        name: "Admin FLOW",
        email: "filipebiten@gmail.com",
        whatsapp: "",
        birthDate: "",
        gender: "",
        pgmRole: "pastor de rede",
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
        participatesIrmandade: false
      };

      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      localStorage.setItem('users', JSON.stringify([adminUser]));
      navigate('/feed');
      return;
    }

    // Check existing users with better debugging
    const usersData = localStorage.getItem('users');
    console.log("Dados brutos do localStorage:", usersData);
    
    if (!usersData) {
      toast({
        title: "Erro",
        description: "Nenhum usuário encontrado. Faça o cadastro primeiro.",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(usersData);
    console.log("Usuários parseados:", users);
    
    const user = users.find((u: any) => {
      console.log("Verificando usuário:", {
        userEmail: u.email,
        userWhatsapp: u.whatsapp,
        inputIdentifier: loginForm.identifier,
        userPassword: u.password,
        inputPassword: loginForm.password
      });

      const emailMatch = u.email && u.email.toLowerCase().trim() === loginForm.identifier.toLowerCase().trim();
      const whatsappMatch = u.whatsapp && u.whatsapp.trim() === loginForm.identifier.trim();
      const passwordMatch = u.password === loginForm.password;
      
      console.log("Matches:", { emailMatch, whatsappMatch, passwordMatch });
      
      return (emailMatch || whatsappMatch) && passwordMatch;
    });

    console.log("Usuário encontrado:", user);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/feed');
      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta, ${user.name}!`,
      });
    } else {
      toast({
        title: "Erro",
        description: "Credenciais inválidas. Verifique seu email/WhatsApp e senha.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = () => {
    console.log("Tentativa de registro com:", registerForm);
    
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
    const userExists = users.some((u: any) => 
      u.email.toLowerCase() === registerForm.email.toLowerCase() || 
      u.whatsapp === registerForm.whatsapp
    );
    
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
      participatesIrmandade: registerForm.gender === "Masculino" ? registerForm.participatesIrmandade : false
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log("Usuário registrado:", newUser);
    console.log("Todos os usuários após registro:", users);

    toast({
      title: "Cadastro realizado!",
      description: `Bem-vindo à FLOW, ${newUser.name}! Agora você pode fazer login.`,
    });

    // Switch to login tab after successful registration
    setActiveTab("login");
    setLoginForm({ identifier: newUser.email, password: "" });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-teal-700">APP da Rede FLOW</CardTitle>
          <div className="flex items-center justify-center space-x-2 mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-700">App em fase de testes</p>
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
                <Label htmlFor="identifier">WhatsApp ou E-mail</Label>
                <Input
                  id="identifier"
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, identifier: e.target.value }))}
                  placeholder="Digite seu WhatsApp ou e-mail"
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

            <TabsContent value="register" className="space-y-4">
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
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite seu e-mail"
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

              {registerForm.birthDate && calculateAge(registerForm.birthDate) >= 25 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flowUp"
                    checked={registerForm.participatesFlowUp}
                    onCheckedChange={(checked) => setRegisterForm(prev => ({ ...prev, participatesFlowUp: !!checked }))}
                  />
                  <Label htmlFor="flowUp" className="text-sm">Participa do FLOW UP</Label>
                </div>
              )}

              {registerForm.gender === "Masculino" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="irmandade"
                    checked={registerForm.participatesIrmandade}
                    onCheckedChange={(checked) => setRegisterForm(prev => ({ ...prev, participatesIrmandade: !!checked }))}
                  />
                  <Label htmlFor="irmandade" className="text-sm">Participa da IRMANDADE</Label>
                </div>
              )}

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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="admin"
                  checked={registerForm.isAdmin}
                  onCheckedChange={(checked) => setRegisterForm(prev => ({ ...prev, isAdmin: !!checked }))}
                />
                <Label htmlFor="admin" className="text-sm">Sou administrador</Label>
              </div>

              <Button onClick={handleRegister} className="w-full bg-teal-600 hover:bg-teal-700">
                Cadastrar
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
