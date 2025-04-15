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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RotateCw, ScrollText } from "lucide-react";
import { useState, useEffect } from "react";

interface LogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogDialog({ open, onOpenChange }: LogDialogProps) {
  const { logs, clearLogs, cpuMetrics } = useThreadStore();
  
  // Simple time formatter function
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Convert to seconds
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    
    // Convert to minutes
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    
    // Convert to hours
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    // Convert to days
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            System Logs
          </DialogTitle>
          <DialogDescription>
            View the history of system events and thread operations
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between mb-2 items-center">
          <div className="text-sm">
            <span className="font-semibold">Total Context Switches:</span> {cpuMetrics.contextSwitches}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearLogs}
            className="gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Reset Logs
          </Button>
        </div>
        
        <div className="border rounded-md overflow-hidden max-h-[50vh]">
          <ScrollArea className="h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/3">Message</TableHead>
                  <TableHead className="w-1/6">Type</TableHead>
                  <TableHead className="w-1/6">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      No logs available.
                    </TableCell>
                  </TableRow>
                ) : (
                  [...logs].reverse().map((log, index) => {
                    // Determine if this log is related to context switch
                    const isContextSwitch = log.message.includes('started execution') || 
                                            log.message.includes('paused') ||
                                            log.message.includes('waiting for');
                    
                    // Get reason if it's in the message
                    let reason = "";
                    if (log.message.includes('waiting for')) {
                      reason = log.message.split('waiting for')[1].trim();
                    }
                    
                    return (
                      <TableRow key={index} className={isContextSwitch ? "bg-amber-50 dark:bg-amber-950/20" : ""}>
                        <TableCell className="font-medium">
                          {log.message}
                          {reason && <span className="block text-xs italic mt-1">Reason: Waiting for resource {reason}</span>}
                        </TableCell>
                        <TableCell>
                          {isContextSwitch ? (
                            <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full">
                              Context Switch
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300 rounded-full">
                              System Event
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
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