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

interface ModelInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModelInfoDialog({ open, onOpenChange }: ModelInfoDialogProps) {
  const { activeModel } = useThreadStore();
  
  // Model descriptions
  const modelDescriptions = {
    "many-to-one": {
      title: "Many-to-One (Green Threads)",
      description: "Multiple user threads map to a single kernel thread",
      characteristics: [
        "Single kernel thread handles all user threads",
        "Low overhead for thread creation/termination",
        "If one thread blocks on I/O, all threads block",
        "Limited parallelism (no true concurrency)",
        "Scheduling managed by the application, not the OS",
        "Examples: Early JVM implementations, GNU Portable Threads"
      ],
      pros: [
        "Efficient thread creation",
        "Low memory usage",
        "Application-level scheduling control"
      ],
      cons: [
        "Cannot utilize multiple CPU cores",
        "One blocked thread blocks all threads",
        "Poor performance for I/O-bound applications"
      ]
    },
    "one-to-one": {
      title: "One-to-One (Native Threads)",
      description: "Each user thread maps directly to a kernel thread",
      characteristics: [
        "Each user thread has its own kernel thread",
        "True parallelism on multicore processors",
        "OS manages thread scheduling",
        "Higher overhead for thread creation",
        "Independent blocking - one thread can block without affecting others",
        "Examples: Windows threads, Linux NPTL, POSIX threads"
      ],
      pros: [
        "True concurrency on multiple cores",
        "Better performance for I/O-bound applications",
        "Independent thread execution"
      ],
      cons: [
        "Higher overhead for thread creation/termination",
        "Higher memory usage per thread",
        "Limited by OS thread capacity"
      ]
    },
    "many-to-many": {
      title: "Many-to-Many (Hybrid Threads)",
      description: "Multiple user threads map to multiple kernel threads",
      characteristics: [
        "Multiplexes user threads onto a smaller set of kernel threads",
        "Combines benefits of both models",
        "Two-level scheduling (application and OS level)",
        "Good balance between performance and resource usage",
        "Examples: Windows ThreadPool, Java Thread Pool"
      ],
      pros: [
        "Scales well with large number of threads",
        "Good balance of performance and resource usage",
        "Developers can create as many threads as needed"
      ],
      cons: [
        "More complex implementation",
        "Harder to predict performance characteristics",
        "May still have thread contention issues"
      ]
    }
  };
  
  const currentModel = modelDescriptions[activeModel as keyof typeof modelDescriptions];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentModel.title}</DialogTitle>
          <DialogDescription>
            {currentModel.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium text-lg">Key Characteristics</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {currentModel.characteristics.map((item, index) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 bg-green-50 dark:bg-green-950/20">
              <h3 className="font-medium text-green-700 dark:text-green-400">Advantages</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {currentModel.pros.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="border rounded-md p-4 bg-red-50 dark:bg-red-950/20">
              <h3 className="font-medium text-red-700 dark:text-red-400">Disadvantages</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {currentModel.cons.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-2">
            <h3 className="font-medium">Simulation Behavior</h3>
            <p className="text-sm mt-1">
              {activeModel === "many-to-one" && 
                "In this simulation, only one thread can run at a time, and I/O operations have a lower chance of completing. Context switches are managed at the application level."}
              {activeModel === "one-to-one" && 
                "In this simulation, multiple threads can run simultaneously. Thread starts are based on priority, and I/O operations have a higher chance of completing."}
              {activeModel === "many-to-many" && 
                "In this simulation, multiple threads can run with a medium chance of starting. I/O operations have a balanced completion rate, offering the best utilization of resources."}
            </p>
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