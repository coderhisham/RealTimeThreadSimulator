"use client";

import { useState } from "react";
import { Resource, useThreadStore } from "@/store/thread-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, HardDrive, Network, File, Cpu } from "lucide-react";

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceDialog({ open, onOpenChange }: ResourceDialogProps) {
  const { resources, addResource, removeResource, threads } = useThreadStore();
  
  const [resourceName, setResourceName] = useState("");
  const [resourceType, setResourceType] = useState<Resource["type"]>("memory");

  const handleSubmit = () => {
    if (resourceName.trim() === "") return;
    
    addResource(resourceName, resourceType);
    setResourceName("");
  };
  
  // Get resource type icon
  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "memory":
        return <HardDrive className="h-4 w-4" />;
      case "network":
        return <Network className="h-4 w-4" />;
      case "file":
        return <File className="h-4 w-4" />;
      case "device":
        return <Cpu className="h-4 w-4" />;
    }
  };
  
  // Get resource status
  const getResourceStatus = (resource: Resource) => {
    if (!resource.inUseBy) {
      return { status: "Available", className: "text-green-500" };
    }
    
    const thread = threads.find(t => t.id === resource.inUseBy);
    return { 
      status: thread ? `In use by ${thread.name}` : `In use (${resource.inUseBy})`, 
      className: "text-amber-500" 
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Resource Management</DialogTitle>
          <DialogDescription>
            Create and manage system resources that threads can access
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Add resource form */}
          <div className="grid grid-cols-3 gap-3 items-end">
            <div className="col-span-3 md:col-span-1">
              <Label htmlFor="resourceType">Resource Type</Label>
              <Select
                value={resourceType}
                onValueChange={(value) => setResourceType(value as Resource["type"])}
              >
                <SelectTrigger id="resourceType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="memory">Memory</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="device">Device</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3 md:col-span-1">
              <Label htmlFor="resourceName">Name</Label>
              <Input
                id="resourceName"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="Resource name"
              />
            </div>
            <div className="col-span-3 md:col-span-1">
              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={resourceName.trim() === ""}
              >
                Add Resource
              </Button>
            </div>
          </div>
          
          {/* Resources list */}
          <div className="mt-4 border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      No resources available. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  resources.map((resource) => {
                    const { status, className } = getResourceStatus(resource);
                    return (
                      <TableRow key={resource.id}>
                        <TableCell className="p-2 text-center">
                          <div className="flex justify-center">
                            {getResourceIcon(resource.type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{resource.name}</TableCell>
                        <TableCell className={className}>{status}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeResource(resource.id)}
                            disabled={!!resource.inUseBy}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
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