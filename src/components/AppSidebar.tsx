import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {LogOut, Shield, Target, User, Users} from 'lucide-react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {getUserPhase, Phase} from '@/utils/phaseUtils';
import {useUserProfile} from "@/hooks/useUserProfile.tsx";
import {LoadingComponent} from "@/components/LoadingComponent.tsx";
import {PhaseBadge} from "@/components/PhaseBadge.tsx";
import {PhasePhrase} from "@/components/PhasePhrase.tsx";

const menuItems = [
  {
    title: "Feed",
    url: "/feed",
    icon: Users,
  },
  {
    title: "Missões",
    url: "/missions",
    icon: Target,
  },
  {
    title: "Perfil",
    url: "/profile",
    icon: User,
  },
];

const adminItems = [
  {
    title: "Painel Admin",
    url: "/admin",
    icon: Shield,
  },
];

function UserHeaderInfo(props: { onClick: () => void, profile: UserProfile, userInitials: string, userPhase: Phase }) {
  return (<>
    {/* Phase Info */}
    <div className="space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Fase Atual</span>
        <PhaseBadge userPhase={props.userPhase.name}/>
      </div>
      <div className="text-xs text-muted-foreground">
        <span className="font-medium">{props.profile?.points || 0}</span> pontos
      </div>
      <PhasePhrase userPhase={props.userPhase}/>
    </div>
  </>)
}

export function AppSidebar() {
  const { profile, signOut, loading } =  useUserProfile();
  const location = useLocation();

  const userPhase = getUserPhase(profile?.points || 0);

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    signOut();
  };

  const handleProfileClick = () => {
    // Use Link component or navigate programmatically
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        {/* User Info moved to top */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar
              className="w-10 h-10 cursor-pointer"
              onClick={handleProfileClick}
          >
            {profile?.profile_photo_url ? (
                <AvatarImage src={profile.profile_photo_url} alt={profile.name}/>
            ) : (
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold">
                  {getUserInitials(profile?.name || 'Usuário')}
                </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p
                className="text-sm font-medium truncate cursor-pointer hover:text-blue-600"
                onClick={handleProfileClick}
            >
              {profile?.name || "Usuário"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.pgm_number ? `PGM ${profile?.pgm_number}` : profile?.pgm_number || "Usuário"}
            </p>
          </div>
        </div>
        { loading ?
            <LoadingComponent></LoadingComponent> :
            (<UserHeaderInfo onClick={handleProfileClick} profile={profile}
                             userInitials={getUserInitials(profile?.name || 'Usuário')} userPhase={userPhase}/>)}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4"/>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {profile?.is_admin && (
            <SidebarGroup>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                          <Link to={item.url}>
                            <item.icon className="w-4 h-4"/>
                            <span>{item.title}</span>
                            <Badge variant="secondary" className="ml-auto">Admin</Badge>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        {/* REDE FLOW branding moved to bottom */}
        <div className="flex items-center gap-3">
          <div
              className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h2 className="font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">REDE
              FLOW</h2>
            <p className="text-xs text-muted-foreground">POSTURA | IDENTIDADE | OBEDIÊNCIA</p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2"/>
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
