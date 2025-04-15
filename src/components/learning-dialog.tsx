"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThreadStore } from "@/store/thread-store";
import { BookOpen, Cpu, LayoutGrid, GitBranch, Users, Server } from "lucide-react";
import { ThreadingModelDiagram } from "@/components/learning-diagram";

interface LearningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearningDialog({ open, onOpenChange }: LearningDialogProps) {
  const [activeTab, setActiveTab] = useState("introduction");
  const { activeModel } = useThreadStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Threading Models & Theory</DialogTitle>
          <DialogDescription>
            Learn about operating system thread management models and concepts
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="introduction" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Intro
            </TabsTrigger>
            <TabsTrigger value="one-to-one" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              One-to-One
            </TabsTrigger>
            <TabsTrigger value="many-to-one" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Many-to-One
            </TabsTrigger>
            <TabsTrigger value="many-to-many" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Many-to-Many
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Comparison
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="introduction" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Understanding Threads</h3>
              <p className="mb-2">
                A thread is the smallest unit of execution within a process. Multiple threads within the same process share the process's resources but can be scheduled and executed independently.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-md p-3 bg-slate-50 dark:bg-slate-900/40">
                  <h4 className="font-medium mb-2">Thread Components</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Thread ID</li>
                    <li>Program counter</li>
                    <li>Register set</li>
                    <li>Stack</li>
                  </ul>
                </div>
                <div className="border rounded-md p-3 bg-slate-50 dark:bg-slate-900/40">
                  <h4 className="font-medium mb-2">Thread Benefits</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Responsiveness</li>
                    <li>Resource sharing</li>
                    <li>Economy</li>
                    <li>Scalability</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">User vs Kernel Threads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">User Threads</h4>
                  <p className="text-sm mb-2">
                    User threads are managed by user-level threads libraries, without kernel support.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Fast to create and manage</li>
                    <li>Can be implemented on any OS</li>
                    <li>If one thread blocks, all threads within the process may block</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Kernel Threads</h4>
                  <p className="text-sm mb-2">
                    Kernel threads are supported and managed directly by the operating system.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Slower to create and manage</li>
                    <li>If one thread blocks, another can run</li>
                    <li>Can take advantage of multiprocessor systems</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Thread States</h3>
              <p className="text-sm mb-3">
                During its lifetime, a thread moves through different states:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2 border rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Ready</h4>
                  <p className="text-xs">Thread is waiting to be assigned to a processor</p>
                </div>
                <div className="p-2 border rounded-md bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-medium text-green-800 dark:text-green-400">Running</h4>
                  <p className="text-xs">Thread is executing instructions</p>
                </div>
                <div className="p-2 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-medium text-blue-800 dark:text-blue-400">Waiting</h4>
                  <p className="text-xs">Thread is waiting for an event (I/O, synchronization)</p>
                </div>
                <div className="p-2 border rounded-md bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-medium text-red-800 dark:text-red-400">Terminated</h4>
                  <p className="text-xs">Thread has completed execution</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="one-to-one" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">One-to-One Threading Model</h3>
              <p className="mb-3">
                In the One-to-One model, each user thread is mapped to a kernel thread. This provides true concurrency and allows threads to run in parallel on multiprocessor systems.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/40 rounded-md p-4 mb-4">
                <div className="flex justify-center mb-4">
                  <ThreadingModelDiagram model="one-to-one" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Advantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Provides true concurrency with multiprocessors</li>
                    <li>If one thread blocks, others can still execute</li>
                    <li>Better application responsiveness</li>
                    <li>Real-time thread operations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Disadvantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Creating a user thread requires creating a kernel thread</li>
                    <li>Higher overhead than user-level threads</li>
                    <li>Thread operations are slower</li>
                    <li>Limited by OS constraints on kernel thread count</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Implementation Examples</h3>
              <div className="space-y-2">
                <p className="text-sm">Common implementations of the One-to-One model include:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Windows threads implementation</li>
                  <li>Linux NPTL (Native POSIX Threading Library)</li>
                  <li>Solaris 9 and later versions</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="many-to-one" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Many-to-One Threading Model</h3>
              <p className="mb-3">
                In the Many-to-One model, many user threads are mapped to a single kernel thread. Also known as the "Green Threads" model, thread management occurs in user space.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/40 rounded-md p-4 mb-4">
                <div className="flex justify-center mb-4">
                  <ThreadingModelDiagram model="many-to-one" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Advantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Thread management is efficient (done in user space)</li>
                    <li>Thread creation, switching and synchronization are fast</li>
                    <li>Can be implemented on any operating system</li>
                    <li>Low memory overhead for threads</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Disadvantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>If one thread blocks on I/O, all threads are blocked</li>
                    <li>Cannot utilize multiple processors (no true parallelism)</li>
                    <li>Scheduler has no visibility into thread states</li>
                    <li>Poor performance for I/O-bound applications</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Implementation Examples</h3>
              <div className="space-y-2">
                <p className="text-sm">Common implementations of the Many-to-One model include:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Early Java thread implementations (Green Threads)</li>
                  <li>GNU Portable Threads</li>
                  <li>Early Solaris versions</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="many-to-many" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Many-to-Many Threading Model</h3>
              <p className="mb-3">
                In the Many-to-Many model, multiple user threads are mapped to multiple kernel threads. This hybrid approach combines advantages of both One-to-One and Many-to-One models.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/40 rounded-md p-4 mb-4">
                <div className="flex justify-center mb-4">
                  <ThreadingModelDiagram model="many-to-many" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Advantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Allows developers to create as many user threads as needed</li>
                    <li>Kernel threads can run in parallel on multiprocessors</li>
                    <li>When a thread blocks, the system can schedule another thread</li>
                    <li>Good balance between performance and resource usage</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Disadvantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>More complex implementation and maintenance</li>
                    <li>Scheduling complexity with two-level scheduling</li>
                    <li>Overhead for managing multiplexing of threads</li>
                    <li>Thread contention can still occur</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Implementation Examples</h3>
              <div className="space-y-2">
                <p className="text-sm">Common implementations of the Many-to-Many model include:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Windows with Thread Pools</li>
                  <li>Java Thread Pools with ExecutorService</li>
                  <li>POSIX Pthreads Scheduling Scopes</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Threading Models Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="border p-2 text-left">Feature</th>
                      <th className="border p-2 text-left">One-to-One</th>
                      <th className="border p-2 text-left">Many-to-One</th>
                      <th className="border p-2 text-left">Many-to-Many</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 font-medium">Parallelism</td>
                      <td className="border p-2">High</td>
                      <td className="border p-2">None</td>
                      <td className="border p-2">Moderate</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">Creation Overhead</td>
                      <td className="border p-2">High</td>
                      <td className="border p-2">Low</td>
                      <td className="border p-2">Moderate</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">Blocking Impact</td>
                      <td className="border p-2">Only affected thread</td>
                      <td className="border p-2">All threads</td>
                      <td className="border p-2">Minimized</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">Scalability</td>
                      <td className="border p-2">Limited by OS</td>
                      <td className="border p-2">Unlimited</td>
                      <td className="border p-2">Good</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">System Portability</td>
                      <td className="border p-2">OS Dependent</td>
                      <td className="border p-2">Highly Portable</td>
                      <td className="border p-2">Moderate</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">Best For</td>
                      <td className="border p-2">CPU-intensive apps</td>
                      <td className="border p-2">Lightweight threading</td>
                      <td className="border p-2">Balanced workloads</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Performance Characteristics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3 border rounded-md p-3 bg-slate-50 dark:bg-slate-900/40">
                  <h4 className="font-medium text-center">One-to-One</h4>
                  <div>
                    <p className="text-sm font-medium flex justify-between">
                      <span>CPU Utilization</span>
                      <span className="text-green-600">90%</span>
                    </p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex justify-between">
                      <span>Throughput</span>
                      <span className="text-green-600">85%</span>
                    </p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex justify-between">
                      <span>Resource Usage</span>
                      <span className="text-amber-600">75%</span>
                    </p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 border rounded-md p-3 bg-slate-50 dark:bg-slate-900/40">
                  <h4 className="font-medium text-center">Many-to-One</h4>
                  <div>
                    <p className="text-sm font-medium flex justify-between">
                      <span>CPU Utilization</span>
                      <span className="text-amber-600">50%</span>
                    </p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex justify-between">
                      <span>Throughput</span>
                      <span className="text-red-600">40%</span>
                    </p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex justify-between">
                      <span>Resource Usage</span>
                      <span className="text-green-600">35%</span>
                    </p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 border rounded-md p-3 bg-slate-50 dark:bg-slate-900/40">
                  <h4 className="font-medium text-center">Many-to-Many</h4>
                  <div>
                    <p className="text-sm font-medium flex justify-between">
                      <span>CPU Utilization</span>
                      <span className="text-green-600">80%</span>
                    </p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex justify-between">
                      <span>Throughput</span>
                      <span className="text-green-600">75%</span>
                    </p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex justify-between">
                      <span>Resource Usage</span>
                      <span className="text-amber-600">60%</span>
                    </p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: "60%" }}></div>
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