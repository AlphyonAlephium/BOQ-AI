
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const Projects = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#EFF0F2]">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-700 mb-8">PROJECTS</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p>Projects content will go here.</p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Projects;
