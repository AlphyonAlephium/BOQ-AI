
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Scan } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
  onDelete: () => void;
}

export const DeleteProjectButton: React.FC<DeleteProjectButtonProps> = ({ 
  projectId, 
  projectName,
  onDelete 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsScanning(true);
    
    try {
      // Delete the project from Supabase
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', projectId);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Show success toast after "scanning" animation completes
      setTimeout(() => {
        setIsScanning(false);
        toast({
          title: "Project Deleted",
          description: `${projectName} has been successfully removed.`,
        });
        setOpen(false);
        // Trigger the onDelete callback to refresh the list
        onDelete();
      }, 1500);
      
    } catch (error) {
      setIsScanning(false);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
      console.error('Delete error:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="ml-2">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{projectName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Button
              variant="destructive-animation"
              onClick={handleDelete}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <Scan className="h-4 w-4 animate-pulse" />
                  <span className="relative">
                    Analyzing...
                    <span 
                      className="absolute top-0 left-0 h-full bg-white/20"
                      style={{
                        width: '100%',
                        animation: 'scanAnimation 1.5s linear',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, white, transparent)',
                        maskImage: 'linear-gradient(to right, transparent, white, transparent)'
                      }}
                    />
                  </span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
