"use client";

import { useThreadStore } from "@/store/thread-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModelContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModelContentDialog({ open, onOpenChange }: ModelContentDialogProps) {
  const { activeModel } = useThreadStore();
  
  // Model content descriptions
  const modelContent = {
    "many-to-one": {
      title: "Many-to-One Model Content",
      description: "Detailed content and implementation details for Many-to-One model",
      content: [
        "In the Many-to-One model, multiple user threads map to a single kernel thread.",
        "The threading library manages threads at the user level.",
        "Context switches are fast but there's no true parallelism."
      ]
    },
    "one-to-one": {
      title: "One-to-One Model Content",
      description: "Detailed content and implementation details for One-to-One model",
      content: [
        "In the One-to-One model, each user thread maps directly to a kernel thread.",
        "The operating system manages all threads directly.",
        "True parallelism is possible but thread creation is more expensive."
      ]
    },
    "many-to-many": {
      title: "Many-to-Many Model Content",
      description: "Detailed content and implementation details for Many-to-Many model",
      content: [
        "In the Many-to-Many model, multiple user threads map to a pool of kernel threads.",
        "This provides a balance between parallelism and resource usage.",
        "The system can dynamically adjust the number of kernel threads based on load."
      ]
    }
  };
  
  const currentModel = modelContent[activeModel as keyof typeof modelContent];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentModel.title}</DialogTitle>
          <DialogDescription>
            {currentModel.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            {currentModel.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 