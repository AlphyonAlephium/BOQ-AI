
import React, { useState } from 'react';
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

type Project = {
  id: string;
  name: string;
  date: string;
  type: string;
  imageUrl?: string;
};

const Dashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | undefined>(undefined);
  const [recentProjects, setRecentProjects] = useState<Project[]>([
    { id: '1', name: 'Construction Project', date: 'Apr 15, 2024', type: 'BoQ' },
    { id: '2', name: 'Construction Project', date: 'Apr 10, 2024', type: 'BOF' },
    { id: '3', name: 'Construction Project', date: 'Apr 3, 2024', type: 'BOF' },
    { id: '4', name: 'Construction Project', date: 'Mar 25, 2024', type: 'BoQ' },
  ]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (file: File | null, fileUrl?: string) => {
    setSelectedFile(file);
    setFilePreviewUrl(fileUrl);
  };

  const handleGenerate = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }
    
    // Add the new project to the recent projects list
    const newProject = {
      id: Date.now().toString(),
      name: selectedFile.name.split('.')[0],
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'BoQ',
      imageUrl: filePreviewUrl
    };
    
    setRecentProjects([newProject, ...recentProjects.slice(0, 4)]);
    
    toast({
      title: "Success!",
      description: "Bill of quantities generated successfully",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible="offcanvas" className="bg-[#2d1d69]">
          <div className="px-6 py-8">
            <h1 className="text-4xl font-bold text-white">BOQ-AI</h1>
          </div>
          <SidebarContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-4 text-white hover:bg-[#3d2d79]">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="flex items-center gap-4 text-white hover:bg-[#3d2d79]"
                  onClick={() => navigate('/projects')}
                >
                  <FolderKanban />
                  <span>Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="flex items-center gap-4 text-white hover:bg-[#3d2d79]"
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
                  className="flex items-center gap-4 text-white hover:bg-[#3d2d79]"
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
          {/* Header */}
          <header className="bg-[#2d1d69] text-white p-6">
            <h1 className="text-2xl font-medium">DASHBOARD</h1>
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
              <Card className="flex justify-center items-center p-6">
                {filePreviewUrl ? (
                  <img 
                    src={filePreviewUrl} 
                    alt="Blueprint Preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <img 
                    src="/lovable-uploads/d121794b-0db7-4ddc-9a16-61867785792c.png" 
                    alt="Blueprint Preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </Card>
            </div>

            {/* Recent Projects Table */}
            <Card className="mt-6 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium text-gray-800">Recent Projects</h2>
              </div>
              
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
                  {recentProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        {project.imageUrl ? (
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            <img 
                              src={project.imageUrl} 
                              alt={project.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                            <FileUp size={16} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.date}</TableCell>
                      <TableCell>{project.type}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="secondary">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
