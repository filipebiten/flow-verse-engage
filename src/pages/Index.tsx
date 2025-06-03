
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [showFlowUp, setShowFlowUp] = useState(false);
  const [showIrmandade, setShowIrmandade] = useState(false);
  const [showPgmNumber, setShowPgmNumber] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    whatsapp: "",
    birthDate: "",
    gender: "",
    pgmRole: "",
    pgmNumber: "",
    participatesFlowUp: false,
    participatesIrmandade: false,
    profilePhoto: null as File | null
  });

  useEffect(() => {
    // Clear localStorage to start fresh
    if (!isLogin) {
      localStorage.clear();
    }
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      navigate('/feed');
    }
  }, [navigate, isLogin]);

  useEffect(() => {
    if (formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const userAge = currentYear - birthYear;
      setAge(userAge);
      setShowFlowUp(userAge > 25);
    }
  }, [formData.birthDate]);

  useEffect(() => {
    setShowIrmandade(formData.gender === "Masculino");
    if (formData.gender !== "Masculino") {
      setFormData(prev => ({ ...prev, participatesIrmandade: false }));
    }
  }, [formData.gender]);

  useEffect(() => {
    const needsPgmNumber = formData.pgmRole === "Participante" || formData.pgmRole === "Líder";
    setShowPgmNumber(needsPgmNumber);
    if (!needsPgmNumber) {
      setFormData(prev => ({ ...prev, pgmNumber: "" }));
    }
  }, [formData.pgmRole]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
    }
  };

  const handleLogin = () => {
    // Special admin access for filipebiten@gmail.com
    if (formData.email === "filipebiten@gmail.com" && formData.password === "filipe") {
      const adminUser = {
        id: "admin-filipe",
        name: "Filipe Admin",
        email: "filipebiten@gmail.com",
        whatsapp: "",
        birthDate: "",
        gender: "",
        pgmRole: "Pastor de Rede",
        pgmNumber: "",
        participatesFlowUp: false,
        participatesIrmandade: false,
        isAdmin: true,
        phase: "Oceano",
        points: 1500,
        profilePhoto: null,
        joinDate: new Date().toISOString(),
        booksRead: [],
        booksReading: [],
        coursesCompleted: [],
        coursesInProgress: []
      };
      
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      navigate('/feed');
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/feed');
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${user.name}!`,
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.whatsapp || !formData.birthDate || !formData.gender || !formData.pgmRole) {
      toast({
        title: "Erro no cadastro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (showPgmNumber && !formData.pgmNumber) {
      toast({
        title: "Erro no cadastro",
        description: "Por favor, informe o número do PGM.",
        variant: "destructive",
      });
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find((u: any) => u.email === formData.email)) {
      toast({
        title: "Erro no cadastro",
        description: "Este email já está cadastrado.",
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      whatsapp: formData.whatsapp,
      birthDate: formData.birthDate,
      gender: formData.gender,
      pgmRole: formData.pgmRole,
      pgmNumber: formData.pgmNumber,
      participatesFlowUp: formData.participatesFlowUp,
      participatesIrmandade: formData.participatesIrmandade,
      isAdmin: isAdmin,
      phase: "Riacho",
      points: 0,
      profilePhoto: formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : null,
      joinDate: new Date().toISOString(),
      booksRead: [],
      booksReading: [],
      coursesCompleted: [],
      coursesInProgress: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    navigate('/feed');
    toast({
      title: "Cadastro realizado com sucesso!",
      description: `Bem-vindo à FLOW, ${newUser.name}!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-teal-700 mb-2">
            FLOW
          </CardTitle>
          <p className="text-gray-600">
            {isLogin ? "Entre na sua conta" : "Cadastre-se na comunidade"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gênero *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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
                <Select value={formData.pgmRole} onValueChange={(value) => handleInputChange("pgmRole", value)}>
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

              {showPgmNumber && (
                <div className="space-y-2">
                  <Label htmlFor="pgmNumber">Número do PGM *</Label>
                  <Input
                    id="pgmNumber"
                    type="text"
                    value={formData.pgmNumber}
                    onChange={(e) => handleInputChange("pgmNumber", e.target.value)}
                    placeholder="Ex: PGM 001"
                  />
                </div>
              )}

              {showFlowUp && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flowUp"
                    checked={formData.participatesFlowUp}
                    onCheckedChange={(checked) => handleInputChange("participatesFlowUp", checked as boolean)}
                  />
                  <Label htmlFor="flowUp">Participa do FLOW UP</Label>
                </div>
              )}

              {showIrmandade && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="irmandade"
                    checked={formData.participatesIrmandade}
                    onCheckedChange={(checked) => handleInputChange("participatesIrmandade", checked as boolean)}
                  />
                  <Label htmlFor="irmandade">Participa da IRMANDADE</Label>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="photo">Foto de Perfil (opcional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Foto
                  </Button>
                </div>
                {formData.profilePhoto && (
                  <p className="text-sm text-green-600">Foto selecionada: {formData.profilePhoto.name}</p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Sua senha"
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

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
                  id="isAdmin"
                  checked={isAdmin}
                  onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
                />
                <Label htmlFor="isAdmin">Sou administrador</Label>
              </div>
            </>
          )}

          <Button
            onClick={isLogin ? handleLogin : handleSignup}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isLogin ? "Entrar" : "Cadastrar"}
          </Button>

          {isLogin && (
            <Button variant="link" className="w-full text-teal-600">
              Esqueci minha senha
            </Button>
          )}

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-teal-600"
            >
              {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
