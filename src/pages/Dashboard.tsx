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
import { LayoutDashboard, FolderKanban, Settings, LogOut, FileUp } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EmptyImagePlaceholder } from '@/components/EmptyImagePlaceholder';
import { Skeleton } from '@/components/ui/skeleton';
import TechBackground from '@/components/TechBackground';

type Plan = {
  id: string;
  name: string;
  created_at: string;
  type: string;
  file_url: string;
  file_path: string;
};

const Dashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | undefined>(undefined);
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const [recentPlans, setRecentPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleFileChange = (file: File | null, fileUrl?: string, path?: string) => {
    setSelectedFile(file);
    setFilePreviewUrl(fileUrl);
    setFilePath(path);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !filePreviewUrl || !filePath) {
      toast({
        title: "No file selected",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Add the new plan to the database
      const newPlan = {
        name: selectedFile.name.split('.')[0],
        type: 'BoQ',
        file_url: filePreviewUrl,
        file_path: filePath
      };
      
      const { data, error } = await supabase
        .from('plans')
        .insert([newPlan])
        .select();
        
      if (error) {
        toast({
          title: "Error",
          description: "Failed to save the project",
          variant: "destructive",
        });
        console.error('Error saving plan:', error);
        return;
      }
      
      // Refresh the plans list
      const { data: updatedPlans, error: fetchError } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (!fetchError && updatedPlans) {
        setRecentPlans(updatedPlans);
      }
      
      toast({
        title: "Success!",
        description: "Bill of quantities generated successfully",
      });
      
    } catch (error) {
      console.error('Failed to generate BoQ:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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
        {/* Sidebar with tech background */}
        <Sidebar variant="sidebar" collapsible="offcanvas" className="bg-transparent relative">
          <TechBackground className="z-0" />
          <div className="px-6 py-8 relative z-10">
            <h1 className="text-4xl font-bold text-white">BOQ-AI</h1>
          </div>
          <SidebarContent className="px-2 relative z-10">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-4 text-white hover:bg-white/10">
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
          <SidebarFooter className="mt-auto mb-6 relative z-10">
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

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header with tech background */}
          <header className="relative text-white p-6">
            <TechBackground className="z-0" />
            <h1 className="text-2xl font-medium relative z-10">DASHBOARD</h1>
          </header>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Card */}
              <Card className="p-6">
                <h2 className="text-2xl font-medium text-gray-800 mb-2">Generate Bill of Quantities</h2>
                <p className="text-gray-600 mb-6">Upload a building plan to start generating a bill of quantities</p>
                
                <FileUploader onFileChange={handleFileChange} />
                
                <Button 
                  className="w-full mt-6 bg-[#5746c9] hover:bg-[#4938b9] text-white py-6"
                  onClick={handleGenerate}
                >
                  GENERATE
                </Button>
              </Card>

              {/* Blueprint Preview */}
              <Card className="flex justify-center items-center p-6 h-[400px]">
                {filePreviewUrl ? (
                  <img 
                    src={filePreviewUrl} 
                    alt="Blueprint Preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <EmptyImagePlaceholder className="h-full" />
                )}
              </Card>
            </div>

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
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            <EmptyImagePlaceholder />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{formatDate(plan.created_at)}</TableCell>
                        <TableCell>{plan.type}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="secondary">View</Button>
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
    </SidebarProvider>
  );
};

export default Dashboard;
