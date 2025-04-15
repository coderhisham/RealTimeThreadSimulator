"use client";

import { useState } from "react";
import { Thread, useThreadStore } from "@/store/thread-store";
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

interface ThreadDialogProps {
  thread: Thread | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function ThreadDialog({
  thread,
  open,
  onOpenChange,
  onClose,
}: ThreadDialogProps) {
  const { addThread, updateThread } = useThreadStore();
  const isEditing = !!thread;

  const [name, setName] = useState(thread?.name || "");
  const [priority, setPriority] = useState<number>(thread?.priority || 5);
  const [executionTime, setExecutionTime] = useState<number>(
    thread?.executionTime || 3000
  );

  // Reset form when dialog opens/closes or thread changes
  useState(() => {
    if (open) {
      setName(thread?.name || "");
      setPriority(thread?.priority || 5);
      setExecutionTime(thread?.executionTime || 3000);
    }
  });

  const handleSubmit = () => {
    if (name.trim() === "") return;

    if (isEditing && thread) {
      updateThread(thread.id, {
        name,
        priority,
        executionTime,
        remainingTime: thread.status === "running" ? thread.remainingTime : executionTime,
      });
    } else {
      addThread({
        name,
        priority,
        status: "ready",
        executionTime,
        remainingTime: executionTime,
      });
    }

    onOpenChange(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Thread" : "Add Thread"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the thread details below."
              : "Create a new thread with the details below."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Thread name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority.toString()}
              onValueChange={(value) => setPriority(parseInt(value))}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                  <SelectItem key={p} value={p.toString()}>
                    {p} {p === 10 ? "(Highest)" : p === 1 ? "(Lowest)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="executionTime">Execution Time (ms)</Label>
            <Input
              id="executionTime"
              type="number"
              value={executionTime}
              onChange={(e) => setExecutionTime(parseInt(e.target.value))}
              min={100}
              step={100}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 