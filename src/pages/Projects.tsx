
import React, { useState, useEffect } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter
} from '@/components/ui/sidebar';
import { LayoutDashboard, FolderKanban, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TechBackground } from '@/components/TechBackground';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { EmptyImagePlaceholder } from '@/components/EmptyImagePlaceholder';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteProjectButton } from '@/components/DeleteProjectButton';

type Plan = {
  id: string;
  name: string;
  created_at: string;
  type: string;
  file_url: string;
  file_path: string;
};

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }
      
      setProjects(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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
                  <SidebarMenuButton className="flex items-center gap-4 text-white hover:bg-white/10 bg-white/10">
                    <FolderKanban />
                    <span>Projects</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="flex items-center gap-4 text-white hover:bg-white/10"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings />
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
              <h1 className="text-2xl font-medium">PROJECTS</h1>
            </header>
          </TechBackground>

          {/* Content */}
          <div className="p-6">
            <Card className="p-6">
              <h2 className="text-2xl font-medium mb-4">All Projects</h2>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Preview</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            <EmptyImagePlaceholder />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{formatDate(project.created_at)}</TableCell>
                        <TableCell>{project.type}</TableCell>
                        <TableCell className="text-right flex justify-end">
                          <Button variant="secondary">View</Button>
                          <DeleteProjectButton 
                            projectId={project.id} 
                            projectName={project.name} 
                            onDelete={fetchProjects}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No projects yet. Go to the dashboard to create a new project.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Projects;
