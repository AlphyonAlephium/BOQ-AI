
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { LayoutDashboard, FolderKanban, Settings, LogOut, FileUp, Trash2, Eye } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EmptyImagePlaceholder } from '@/components/EmptyImagePlaceholder';
import { Skeleton } from '@/components/ui/skeleton';
import { TechBackground } from '@/components/TechBackground';
import { ProjectViewer } from '@/components/ProjectViewer';
import { TabInterface } from '@/components/TabInterface';
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
  spec_url?: string;
  spec_path?: string;
  spec_type?: string;
};

const Dashboard: React.FC = () => {
  const [recentPlans, setRecentPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch recent plans on component mount
  useEffect(() => {
    const fetchRecentPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) {
          console.error('Error fetching plans:', error);
          return;
        }
        
        setRecentPlans(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        setIsLoading(false);
      }
    };
    
    fetchRecentPlans();
  }, []);

  const handleDelete = (plan: Plan) => {
    setPlanToDelete(plan);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    
    setIsAlertOpen(false);
    setIsDeletingId(planToDelete.id);
    
    try {
      // Delete the file from storage if it exists
      if (planToDelete.file_path) {
        const { error: storageError } = await supabase.storage
          .from('blueprints')
          .remove([planToDelete.file_path]);
          
        if (storageError) {
          console.error('Error removing file from storage:', storageError);
        }
      }
      
      // Delete the spec file if it exists
      if (planToDelete.spec_path) {
        const { error: specStorageError } = await supabase.storage
          .from('blueprints')
          .remove([planToDelete.spec_path]);
          
        if (specStorageError) {
          console.error('Error removing specification file from storage:', specStorageError);
        }
      }
      
      // Delete the plan from the database
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planToDelete.id);
        
      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete the project",
          variant: "destructive",
        });
        console.error('Error deleting plan:', error);
        return;
      }
      
      // Update the plans list after deletion
      setRecentPlans(prev => prev.filter(p => p.id !== planToDelete.id));
      
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
      setPlanToDelete(null);
    }
  };

  const handleView = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Function to render file preview thumbnails for the table
  const renderThumbnail = (fileUrl: string, fileType?: string) => {
    if (!fileUrl) {
      return <EmptyImagePlaceholder />;
    }
    
    if (fileType === 'pdf') {
      return (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          <FileUp className="h-6 w-6 text-gray-500" />
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
                  <SidebarMenuButton className="flex items-center gap-4 text-white hover:bg-white/10 bg-white/10">
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
              <h1 className="text-2xl font-medium">DASHBOARD</h1>
            </header>
          </TechBackground>

          {/* Content */}
          <div className="p-6">
            <Card className="p-6">
              <h2 className="text-2xl font-medium text-gray-800 mb-6">BOQ Generator</h2>
              <TabInterface />
            </Card>

            {/* Recent Projects Table */}
            <Card className="mt-6 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium text-gray-800">Recent Projects</h2>
              </div>
              
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
              ) : recentPlans.length > 0 ? (
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
                    {recentPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            {renderThumbnail(plan.file_url, plan.file_type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{formatDate(plan.created_at)}</TableCell>
                        <TableCell>{plan.type}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button 
                            variant="secondary"
                            onClick={() => handleView(plan)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleDelete(plan)}
                            disabled={isDeletingId === plan.id}
                            className="relative"
                          >
                            {isDeletingId === plan.id ? (
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
                  <p className="text-gray-500">No projects yet. Upload a blueprint to get started.</p>
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
      {selectedPlan && (
        <ProjectViewer
          open={isViewerOpen}
          onClose={handleCloseViewer}
          projectName={selectedPlan.name}
          fileUrl={selectedPlan.file_url}
          fileType={selectedPlan.file_type}
        />
      )}
    </SidebarProvider>
  );
};

export default Dashboard;
