
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
  Home, 
  Users, 
  Target, 
  User, 
  Settings, 
  BookOpen,
  Trophy,
  BarChart3,
  Shield
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUserPhase } from '@/utils/phaseUtils';

const menuItems = [
  {
    title: "Início",
    url: "/",
    icon: Home,
  },
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
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser?.role === 'admin';
  const userPhase = getUserPhase(currentUser?.points || 0);

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">REDE FLOW</h2>
            <p className="text-xs text-muted-foreground">POSTURA | IDENTIDADE | OBEDIÊNCIA</p>
          </div>
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
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs">
              {getUserInitials(currentUser?.name || 'Usuário')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser?.name || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser?.pgmNumber || currentUser?.pgmRole || 'PGM001'}</p>
          </div>
        </div>

        {/* Phase Info */}
        <div className="space-y-2">
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

        {/* Admin Mode Toggle */}
        {isAdmin && (
          <Button variant="outline" size="sm" className="w-full text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Modo Admin
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
