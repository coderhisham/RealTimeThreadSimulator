"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThreadStateDiagram } from "./thread-state-diagram";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thread, useThreadStore } from "@/store/thread-store";
import { Activity, AlertCircle, BarChart3, Cpu, LineChart, Clock } from "lucide-react";

interface VisualizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisualizationDialog({ open, onOpenChange }: VisualizationDialogProps) {
  const [activeTab, setActiveTab] = useState("state-diagram");
  const { threads, cpuMetrics, activeModel } = useThreadStore();
  
  // Fake timeline data for the execution graph
  const [timelineData, setTimelineData] = useState<{
    timestamps: string[];
    threadActivity: Record<string, string[]>;
    cpuUtilization: number[];
  }>({
    timestamps: [],
    threadActivity: {},
    cpuUtilization: []
  });
  
  // Generate timeline data when the component mounts
  useEffect(() => {
    if (!open) return;
    
    // Generate 20 time points
    const now = new Date();
    const timestamps: string[] = [];
    const cpuUtilization: number[] = [];
    
    for (let i = 0; i < 20; i++) {
      const time = new Date(now.getTime() - (19 - i) * 5000);
      timestamps.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // Generate random CPU utilization data
      cpuUtilization.push(Math.floor(Math.random() * 60) + 20); // Random value between 20-80%
    }
    
    // Generate thread activity data
    const threadActivity: Record<string, string[]> = {};
    
    threads.forEach((thread: Thread) => {
      if (thread.status === 'terminated') return;
      
      const activity: string[] = [];
      for (let i = 0; i < 20; i++) {
        // Generate random thread state for each timestamp
        const randVal = Math.random();
        if (thread.status === 'running') {
          // Running threads are more likely to stay running
          activity.push(randVal < 0.7 ? 'running' : (randVal < 0.85 ? 'ready' : 'waiting'));
        } else if (thread.status === 'waiting') {
          // Waiting threads are more likely to stay waiting
          activity.push(randVal < 0.6 ? 'waiting' : (randVal < 0.9 ? 'ready' : 'running'));
        } else {
          // Ready threads have mixed probabilities
          activity.push(randVal < 0.4 ? 'ready' : (randVal < 0.7 ? 'running' : 'waiting'));
        }
      }
      
      threadActivity[thread.id] = activity;
    });
    
    setTimelineData({
      timestamps,
      threadActivity,
      cpuUtilization
    });
  }, [open, threads]);

  // Count threads by status
  const threadsByStatus = threads.reduce((acc: Record<string, number>, thread: Thread) => {
    acc[thread.status] = (acc[thread.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate model-specific metrics
  const getModelDescription = () => {
    switch (activeModel) {
      case "many-to-one":
        return "This model has higher context switch overhead but lower parallelism.";
      case "one-to-one":
        return "This model offers true parallelism but has higher thread creation cost.";
      case "many-to-many":
        return "This model balances parallelism and overhead with a flexible thread-to-processor mapping.";
      default:
        return "";
    }
  };
  
  // Helper function to get the color class for thread status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'ready': return 'bg-yellow-400';
      case 'waiting': return 'bg-blue-500';
      case 'terminated': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thread Visualization</DialogTitle>
          <DialogDescription>
            Visual representation of thread states, transitions, and performance metrics
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="state-diagram" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              State Diagram
            </TabsTrigger>
            <TabsTrigger value="thread-metrics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Thread Metrics
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="system-status" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              System Status
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="state-diagram" className="mt-0">
            <ThreadStateDiagram />
          </TabsContent>
          
          <TabsContent value="thread-metrics" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Threads by Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span>Ready</span>
                      </div>
                      <span className="font-medium">{threadsByStatus.ready || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Running</span>
                      </div>
                      <span className="font-medium">{threadsByStatus.running || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Waiting</span>
                      </div>
                      <span className="font-medium">{threadsByStatus.waiting || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Terminated</span>
                      </div>
                      <span className="font-medium">{threadsByStatus.terminated || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Thread Priority Distribution</h3>
                  <div className="h-[150px] flex items-end gap-2 mt-4">
                    {Array.from({ length: 3 }).map((_, i) => {
                      const priority = (i + 1) * 5;
                      const count = threads.filter((t: Thread) => 
                        t.priority >= priority - 2 && t.priority <= priority + 2
                      ).length;
                      const height = count ? `${Math.max(20, count * 30)}px` : "20px";
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-primary/70 rounded-t"
                            style={{ height }}
                          ></div>
                          <div className="text-xs mt-1">Priority {priority}</div>
                          <div className="text-xs font-medium">{count} threads</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-0">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Thread Execution Timeline
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Visualizes thread states over time, showing how threads transition between running, ready, and waiting states.
                </p>
                
                <div className="mt-6 space-y-6">
                  {/* Timeline header */}
                  <div className="flex w-full justify-between px-2 text-xs text-muted-foreground">
                    {timelineData.timestamps.length > 0 && (
                      <>
                        <span>{timelineData.timestamps[0]}</span>
                        <span>{timelineData.timestamps[Math.floor(timelineData.timestamps.length / 3)]}</span>
                        <span>{timelineData.timestamps[Math.floor(timelineData.timestamps.length * 2 / 3)]}</span>
                        <span>{timelineData.timestamps[timelineData.timestamps.length - 1]}</span>
                      </>
                    )}
                  </div>
                  
                  {/* CPU utilization graph */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">CPU Utilization</h4>
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex">
                      {timelineData.cpuUtilization.map((util, idx) => (
                        <div 
                          key={idx}
                          className="h-full" 
                          style={{ 
                            width: `${100 / timelineData.cpuUtilization.length}%`,
                            backgroundColor: util > 70 ? '#ef4444' : util > 40 ? '#f59e0b' : '#10b981',
                            opacity: 0.7 + (util / 300) // Vary opacity slightly based on value
                          }}
                          title={`${util}% at ${timelineData.timestamps[idx]}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Thread timelines */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Thread Activity</h4>
                    
                    {Object.entries(timelineData.threadActivity).map(([threadId, activities]) => {
                      const thread = threads.find((t: Thread) => t.id === threadId);
                      if (!thread) return null;
                      
                      return (
                        <div key={threadId} className="space-y-1">
                          <div className="flex justify-between">
                            <p className="text-xs font-medium">{thread.name}</p>
                            <span className="text-xs text-muted-foreground">Priority: {thread.priority}</span>
                          </div>
                          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex">
                            {activities.map((status, idx) => (
                              <div 
                                key={idx}
                                className={`h-full ${getStatusColor(status)}`} 
                                style={{ 
                                  width: `${100 / activities.length}%`,
                                  opacity: 0.8
                                }}
                                title={`${status} at ${timelineData.timestamps[idx]}`}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center gap-4 text-xs pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Running</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span>Ready</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Waiting</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Thread Model Behavior</h3>
                <p className="text-sm">
                  {activeModel === "many-to-one" && 
                    "In the Many-to-One model, notice how there is typically only one thread in the running state at any time, as all user threads map to a single kernel thread."}
                  
                  {activeModel === "one-to-one" && 
                    "In the One-to-One model, multiple threads can be running simultaneously, reflecting the direct mapping between user and kernel threads."}
                  
                  {activeModel === "many-to-many" && 
                    "In the Many-to-Many model, the number of running threads is limited by the number of kernel threads available, showing a balance between utilization and concurrency."}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="system-status" className="mt-0">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Current Threading Model</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold">{activeModel.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join("-")} Model</span>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{getModelDescription()}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground mb-1">CPU Utilization</div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{cpuMetrics.utilization}%</span>
                    <div 
                      className={`h-2 flex-1 rounded-full ${
                        cpuMetrics.utilization > 80 ? "bg-red-500" : 
                        cpuMetrics.utilization > 50 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${cpuMetrics.utilization}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground mb-1">Context Switches</div>
                  <div className="text-2xl font-bold">{cpuMetrics.contextSwitches}</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground mb-1">Active Threads</div>
                  <div className="text-2xl font-bold">{cpuMetrics.threadCount}</div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-3">Thread Model Comparison</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Parallelism</span>
                      <span>Low → High</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-full relative">
                      <div className="absolute top-0 left-[20%] h-4 w-1 bg-yellow-500 -translate-y-1 rounded-full" title="Many-to-One"></div>
                      <div className="absolute top-0 left-[80%] h-4 w-1 bg-green-500 -translate-y-1 rounded-full" title="One-to-One"></div>
                      <div className="absolute top-0 left-[60%] h-4 w-1 bg-blue-500 -translate-y-1 rounded-full" title="Many-to-Many"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overhead</span>
                      <span>Low → High</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-full relative">
                      <div className="absolute top-0 left-[30%] h-4 w-1 bg-yellow-500 -translate-y-1 rounded-full" title="Many-to-One"></div>
                      <div className="absolute top-0 left-[70%] h-4 w-1 bg-green-500 -translate-y-1 rounded-full" title="One-to-One"></div>
                      <div className="absolute top-0 left-[50%] h-4 w-1 bg-blue-500 -translate-y-1 rounded-full" title="Many-to-Many"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs">Many-to-One</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs">One-to-One</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs">Many-to-Many</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 