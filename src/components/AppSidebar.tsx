
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
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
import { 
  Users, 
  Target, 
  User, 
  Shield,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUserPhase } from '@/utils/phaseUtils';
import { useAuth } from '@/hooks/useAuth';

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

export function AppSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser?.isAdmin;
  const userPhase = getUserPhase(currentUser?.points || 0);

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
            {currentUser?.profilePhoto ? (
              <AvatarImage src={currentUser.profilePhoto} alt={currentUser.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold">
                {getUserInitials(currentUser?.name || 'Usuário')}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p 
              className="text-sm font-medium truncate cursor-pointer hover:text-blue-600"
              onClick={handleProfileClick}
            >
              {currentUser?.name || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser?.pgmNumber ? `PGM ${currentUser.pgmNumber}` : currentUser?.pgmRole || 'Usuário'}
            </p>
          </div>
        </div>

        {/* Phase Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Fase Atual</span>
            <Badge variant="outline" className="text-xs">
              {userPhase.icon} {userPhase.name}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{currentUser?.points || 0}</span> pontos
          </div>
          <p className="text-xs italic text-center">"{userPhase.phrase}"</p>
        </div>
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
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
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
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h2 className="font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">REDE FLOW</h2>
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
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
