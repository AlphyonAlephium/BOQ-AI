
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter
} from '@/components/ui/sidebar';
import { LayoutDashboard, FolderKanban, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TechBackground } from '@/components/TechBackground';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <TechBackground>
          <Sidebar variant="sidebar" collapsible="offcanvas" className="bg-transparent">
            <div className="px-6 py-8">
              <h1 className="text-4xl font-bold text-white">BOQ-AI</h1>
            </div>
            <SidebarContent className="px-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="flex items-center gap-4 text-white hover:bg-white/10"
                    onClick={() => navigate('/dashboard')}
                  >
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="flex items-center gap-4 text-white hover:bg-white/10"
                    onClick={() => navigate('/projects')}
                  >
                    <FolderKanban />
                    <span>Projects</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="flex items-center gap-4 text-white hover:bg-white/10 bg-white/10">
                    <SettingsIcon />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="mt-auto mb-6">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="flex items-center gap-4 text-white hover:bg-white/10"
                    onClick={() => navigate('/')}
                  >
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
        </TechBackground>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <TechBackground>
            <header className="text-white p-6">
              <h1 className="text-2xl font-medium">SETTINGS</h1>
            </header>
          </TechBackground>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-2xl font-medium mb-4">Account Settings</h2>
            <p>Settings page content will go here.</p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
