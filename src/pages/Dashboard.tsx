
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

type Project = {
  id: string;
  name: string;
  date: string;
  type: string;
};

const Dashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Demo projects data
  const recentProjects: Project[] = [
    { id: '1', name: 'Construction Project', date: 'Apr 15, 2024', type: 'BoQ' },
    { id: '2', name: 'Construction Project', date: 'Apr 10, 2024', type: 'BOF' },
    { id: '3', name: 'Construction Project', date: 'Apr 3, 2024', type: 'BOF' },
    { id: '4', name: 'Construction Project', date: 'Mar 25, 2024', type: 'BoQ' },
  ];

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleGenerate = () => {
    if (!selectedFile) {
      alert('Please upload a file first');
      return;
    }
    
    // Here you would handle the generation of the bill of quantities
    console.log('Generating bill of quantities for:', selectedFile.name);
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
                <SidebarMenuButton className="flex items-center gap-4 text-white hover:bg-[#3d2d79]">
                  <FolderKanban />
                  <span>Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-4 text-white hover:bg-[#3d2d79]">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="mt-auto mb-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-4 text-white hover:bg-[#3d2d79]">
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
                <img 
                  src="/lovable-uploads/d121794b-0db7-4ddc-9a16-61867785792c.png" 
                  alt="Blueprint Preview" 
                  className="max-w-full max-h-full object-contain"
                />
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
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map((project) => (
                    <TableRow key={project.id}>
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
