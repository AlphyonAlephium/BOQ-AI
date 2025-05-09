
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
import { LayoutDashboard, FolderKanban, Settings, LogOut, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TechBackground } from '@/components/TechBackground';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { EmptyImagePlaceholder } from '@/components/EmptyImagePlaceholder';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectViewer } from '@/components/ProjectViewer';
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Plan = {
  id: string;
  name: string;
  created_at: string;
  type: string;
  file_url: string;
  file_path: string;
  file_type?: string;
};

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Plan | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Plan | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }
        
        setProjects(data || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleView = (project: Plan) => {
    setSelectedProject(project);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  const handleDelete = (project: Plan) => {
    setProjectToDelete(project);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    setIsAlertOpen(false);
    setIsDeletingId(projectToDelete.id);
    
    try {
      // Delete the file from storage if it exists
      if (projectToDelete.file_path) {
        const { error: storageError } = await supabase.storage
          .from('plans')
          .remove([projectToDelete.file_path]);
          
        if (storageError) {
          console.error('Error removing file from storage:', storageError);
        }
      }
      
      // Delete the plan from the database
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', projectToDelete.id);
        
      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete the project",
          variant: "destructive",
        });
        console.error('Error deleting project:', error);
        return;
      }
      
      // Update the projects list after deletion
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeletingId(null);
      setProjectToDelete(null);
    }
  };

  // Function to render file preview thumbnails for the table
  const renderThumbnail = (fileUrl: string, fileType?: string) => {
    if (!fileUrl) {
      return <EmptyImagePlaceholder />;
    }
    
    if (fileType === 'pdf') {
      return (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          <FolderKanban className="h-6 w-6 text-gray-500" />
        </div>
      );
    }
    
    return (
      <img src={fileUrl} alt="Preview" className="w-12 h-12 rounded-md object-cover" />
    );
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
              <h2 className="text-2xl font-medium text-gray-800 mb-6">All Projects</h2>
              
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
                            {renderThumbnail(project.file_url, project.file_type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{formatDate(project.created_at)}</TableCell>
                        <TableCell>{project.type}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button 
                            variant="secondary"
                            onClick={() => handleView(project)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleDelete(project)}
                            disabled={isDeletingId === project.id}
                            className="relative"
                          >
                            {isDeletingId === project.id ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                              </span>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No projects yet. Upload a blueprint on the Dashboard to get started.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Project Viewer */}
      {selectedProject && (
        <ProjectViewer
          open={isViewerOpen}
          onClose={handleCloseViewer}
          projectName={selectedProject.name}
          fileUrl={selectedProject.file_url}
          fileType={selectedProject.file_type}
        />
      )}
    </SidebarProvider>
  );
};

export default Projects;
