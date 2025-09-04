
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Eye, EyeOff, AlertTriangle, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import {uploadProfilePhoto} from "@/services/profileService.ts";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [pgmRole, setPgmRole] = useState('');
  const [pgmNumber, setPgmNumber] = useState('');
  const [participatesFlowUp, setParticipatesFlowUp] = useState(false);
  const [participatesIrmandade, setParticipatesIrmandade] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const isOver25 = birthDate ? calculateAge(birthDate) >= 25 : false;
  const isMale = gender === 'Homem';
  const showPgmNumber = pgmRole === 'Participante' || pgmRole === 'Líder';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    try{

      if (file) {
        setProfilePhoto(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfilePhotoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }catch (e) {
      toast({
        title: "Erro ao atualizar foto",
        className: "bg-red-600",
        description: `Ocorreu um erro ao atualizar a foto: ${e}`,
        variant: "destructive"
      });
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview('');
  };


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erro na confirmação",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const isAdminEmail = email === 'filipebiten@gmail.com';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: name,
            whatsapp: whatsapp,
            email: email,
            birth_date: birthDate,
            gender: gender,
            pgm_role: pgmRole,
            pgm_number: pgmNumber,
            participates_flow_up: participatesFlowUp,
            participates_irmandade: participatesIrmandade,
            is_admin: isAdminEmail
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Conta já existe",
            description: "Esta conta já está registrada. Tente fazer login.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        if (data.user) {
          // Espera até o perfil existir no banco antes de atualizar
          let profileExists = false;
          for (let i = 0; i < 10; i++) { // tenta até 10 vezes
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .single();
            if (profileData) {
              profileExists = true;
              break;
            }
            await new Promise(r => setTimeout(r, 5000)); // espera 1s e tenta de novo
          }

          if (!profileExists) {
            console.error('Perfil não foi criado pela trigger');
            return;
          }

          let profilePhotoUrl = null;
          if (profilePhoto) {
            profilePhotoUrl = await uploadProfilePhoto(data.user.id, profilePhoto);
          }

          if (profilePhotoUrl) {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_photo_url: profilePhotoUrl })
                .eq('id', data.user.id);

            if (updateError) {
              console.error('Erro ao atualizar URL da foto:', updateError);
            }
          }
        }

        setShowEmailConfirmation(true);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: `Ocorreu um erro inesperado.${error}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Credenciais inválidas",
            description: "Email ou senha incorretos.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email não confirmado",
            description: "Verifique seu email e clique no link de confirmação.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta!",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rede FLOW
          </CardTitle>
          <p className="text-muted-foreground">Entre ou crie sua conta</p>
          
          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ Este app está em fase de testes.
              </p>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Login administrador: filipebiten@gmail.com
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                {/* Profile Photo Upload */}
                <div className="space-y-2">
                  <Label>Foto do Perfil (Opcional)</Label>
                  <div className="flex items-center gap-4">
                    {profilePhotoPreview ? (
                      <div className="relative">
                        <img
                          src={profilePhotoPreview}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={removePhoto}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Label
                        htmlFor="photo-upload"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm transition-colors"
                      >
                        Escolher Foto
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-whatsapp">WhatsApp</Label>
                  <Input
                    id="signup-whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birth-date">Data de Nascimento</Label>
                  <Input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Homem">Homem</SelectItem>
                      <SelectItem value="Mulher">Mulher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isOver25 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flow-up"
                      checked={participatesFlowUp}
                      onCheckedChange={(checked) => setParticipatesFlowUp(checked === true)}
                    />
                    <Label htmlFor="flow-up">Participa do FLOW UP</Label>
                  </div>
                )}

                {isMale && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="irmandade"
                      checked={participatesIrmandade}
                      onCheckedChange={(checked) => setParticipatesIrmandade(checked === true)}
                    />
                    <Label htmlFor="irmandade">Participa da IRMANDADE</Label>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="pgm-role">Situação no PGM</Label>
                  <Select value={pgmRole} onValueChange={setPgmRole}>
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
                    <Label htmlFor="pgm-number">Número do PGM</Label>
                    <Input
                      id="pgm-number"
                      type="text"
                      value={pgmNumber}
                      onChange={(e) => setPgmNumber(e.target.value)}
                      placeholder="Ex: PGM001"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua senha"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Email Confirmation Dialog */}
      <AlertDialog open={showEmailConfirmation} onOpenChange={setShowEmailConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>✅ Cadastro Realizado!</AlertDialogTitle>
            <AlertDialogDescription>
              Enviamos um email de confirmação para <strong>{email}</strong>.
              <br /><br />
              Acesse sua caixa de entrada e clique no link para confirmar sua conta antes de fazer login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowEmailConfirmation(false)}>
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Auth;
