"use client";

import { useState } from "react";
import { ThreadModel } from "@/store/thread-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// SVG diagrams for each model type
const ManyToOneDiagram = () => (
  <svg className="w-full max-w-md mx-auto my-4" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    {/* User threads */}
    <rect x="50" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    <rect x="130" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    <rect x="210" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    <rect x="290" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    
    <text x="80" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT1</text>
    <text x="160" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT2</text>
    <text x="240" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT3</text>
    <text x="320" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT4</text>
    
    {/* Thread library */}
    <rect x="50" y="80" width="300" height="40" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
    <text x="200" y="105" textAnchor="middle" fontSize="14" fill="#0c4a6e">User-Space Thread Library</text>
    
    {/* Lines from user threads to library */}
    <line x1="80" y1="60" x2="80" y2="80" stroke="#3b82f6" strokeWidth="2" />
    <line x1="160" y1="60" x2="160" y2="80" stroke="#3b82f6" strokeWidth="2" />
    <line x1="240" y1="60" x2="240" y2="80" stroke="#3b82f6" strokeWidth="2" />
    <line x1="320" y1="60" x2="320" y2="80" stroke="#3b82f6" strokeWidth="2" />
    
    {/* Kernel thread */}
    <rect x="150" y="150" width="100" height="30" rx="5" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
    <text x="200" y="170" textAnchor="middle" fontSize="12" fill="#047857">Kernel Thread</text>
    
    {/* Line from library to kernel thread */}
    <line x1="200" y1="120" x2="200" y2="150" stroke="#0284c7" strokeWidth="2" />
  </svg>
);

const OneToOneDiagram = () => (
  <svg className="w-full max-w-md mx-auto my-4" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    {/* User threads */}
    <rect x="50" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    <rect x="130" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    <rect x="210" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    <rect x="290" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    
    <text x="80" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT1</text>
    <text x="160" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT2</text>
    <text x="240" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT3</text>
    <text x="320" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT4</text>
    
    {/* Kernel threads */}
    <rect x="50" y="150" width="60" height="30" rx="5" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
    <rect x="130" y="150" width="60" height="30" rx="5" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
    <rect x="210" y="150" width="60" height="30" rx="5" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
    <rect x="290" y="150" width="60" height="30" rx="5" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
    
    <text x="80" y="170" textAnchor="middle" fontSize="12" fill="#047857">KT1</text>
    <text x="160" y="170" textAnchor="middle" fontSize="12" fill="#047857">KT2</text>
    <text x="240" y="170" textAnchor="middle" fontSize="12" fill="#047857">KT3</text>
    <text x="320" y="170" textAnchor="middle" fontSize="12" fill="#047857">KT4</text>
    
    {/* Direct lines from user threads to kernel threads */}
    <line x1="80" y1="60" x2="80" y2="150" stroke="#3b82f6" strokeWidth="2" />
    <line x1="160" y1="60" x2="160" y2="150" stroke="#3b82f6" strokeWidth="2" />
    <line x1="240" y1="60" x2="240" y2="150" stroke="#3b82f6" strokeWidth="2" />
    <line x1="320" y1="60" x2="320" y2="150" stroke="#3b82f6" strokeWidth="2" />
  </svg>
);

const ManyToManyDiagram = () => (
  <svg className="w-full max-w-md mx-auto my-4" viewBox="0 0 400 230" xmlns="http://www.w3.org/2000/svg">
    {/* User threads */}
    <rect x="50" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    <rect x="130" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    <rect x="210" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    <rect x="290" y="30" width="60" height="30" rx="5" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
    
    <text x="80" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT1</text>
    <text x="160" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT2</text>
    <text x="240" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT3</text>
    <text x="320" y="50" textAnchor="middle" fontSize="12" fill="#1e40af">UT4</text>
    
    {/* Thread scheduler */}
    <rect x="50" y="100" width="300" height="40" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
    <text x="200" y="125" textAnchor="middle" fontSize="14" fill="#0c4a6e">Thread Scheduler</text>
    
    {/* Lines from user threads to scheduler */}
    <line x1="80" y1="60" x2="80" y2="100" stroke="#3b82f6" strokeWidth="2" />
    <line x1="160" y1="60" x2="160" y2="100" stroke="#3b82f6" strokeWidth="2" />
    <line x1="240" y1="60" x2="240" y2="100" stroke="#3b82f6" strokeWidth="2" />
    <line x1="320" y1="60" x2="320" y2="100" stroke="#3b82f6" strokeWidth="2" />
    
    {/* Kernel threads */}
    <rect x="70" y="180" width="60" height="30" rx="5" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
    <rect x="170" y="180" width="60" height="30" rx="5" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
    <rect x="270" y="180" width="60" height="30" rx="5" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
    
    <text x="100" y="200" textAnchor="middle" fontSize="12" fill="#047857">KT1</text>
    <text x="200" y="200" textAnchor="middle" fontSize="12" fill="#047857">KT2</text>
    <text x="300" y="200" textAnchor="middle" fontSize="12" fill="#047857">KT3</text>
    
    {/* Lines from scheduler to kernel threads with multiplexing */}
    <line x1="100" y1="140" x2="100" y2="180" stroke="#0284c7" strokeWidth="2" />
    <line x1="140" y1="140" x2="100" y2="180" stroke="#0284c7" strokeWidth="2" />
    
    <line x1="180" y1="140" x2="200" y2="180" stroke="#0284c7" strokeWidth="2" />
    <line x1="220" y1="140" x2="200" y2="180" stroke="#0284c7" strokeWidth="2" />
    
    <line x1="260" y1="140" x2="300" y2="180" stroke="#0284c7" strokeWidth="2" />
    <line x1="300" y1="140" x2="300" y2="180" stroke="#0284c7" strokeWidth="2" />
  </svg>
);

interface ModelExplanationProps {
  defaultModel?: ThreadModel;
}

export function ModelExplanation({ defaultModel = "many-to-one" }: ModelExplanationProps) {
  const [activeModel, setActiveModel] = useState<ThreadModel>(defaultModel);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Threading Models Explained</CardTitle>
        <CardDescription>
          Visual comparison of different threading implementation approaches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeModel} onValueChange={(value) => setActiveModel(value as ThreadModel)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="many-to-one">Many-to-One</TabsTrigger>
            <TabsTrigger value="one-to-one">One-to-One</TabsTrigger>
            <TabsTrigger value="many-to-many">Many-to-Many</TabsTrigger>
          </TabsList>
          
          <TabsContent value="many-to-one" className="space-y-4 mt-4">
            <ManyToOneDiagram />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Many-to-One (User-Level Threading)</h3>
              <p>In this model, multiple user threads are mapped to a single kernel thread. All thread management happens in user space through a thread library.</p>
              
              <h4 className="font-medium mt-3">Advantages:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Thread operations are fast (no system calls)</li>
                <li>Thread switching is efficient</li>
                <li>Can be implemented on any OS (even those without thread support)</li>
              </ul>
              
              <h4 className="font-medium mt-3">Disadvantages:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>If one thread blocks on I/O, all threads block</li>
                <li>Cannot utilize multiple CPU cores</li>
                <li>Kernel treats all user threads as a single process</li>
              </ul>
              
              <p className="mt-3 text-sm italic">Real-world examples: Early Java threads (Green threads), GNU Portable Threads</p>
            </div>
          </TabsContent>
          
          <TabsContent value="one-to-one" className="space-y-4 mt-4">
            <OneToOneDiagram />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">One-to-One (Kernel-Level Threading)</h3>
              <p>Each user thread has a corresponding kernel thread. The kernel handles scheduling of all threads directly.</p>
              
              <h4 className="font-medium mt-3">Advantages:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>True parallelism across multiple CPU cores</li>
                <li>One thread blocking doesn't affect others</li>
                <li>Takes advantage of kernel scheduling algorithms</li>
              </ul>
              
              <h4 className="font-medium mt-3">Disadvantages:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Higher overhead for thread creation</li>
                <li>More expensive context switching</li>
                <li>Limited by OS constraints on thread count</li>
              </ul>
              
              <p className="mt-3 text-sm italic">Real-world examples: Linux NPTL (Native POSIX Thread Library), Windows threads</p>
            </div>
          </TabsContent>
          
          <TabsContent value="many-to-many" className="space-y-4 mt-4">
            <ManyToManyDiagram />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Many-to-Many (Hybrid Threading)</h3>
              <p>Multiple user threads are multiplexed onto a smaller or equal number of kernel threads. This provides the best of both models.</p>
              
              <h4 className="font-medium mt-3">Advantages:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Can create as many user threads as needed</li>
                <li>Kernel threads can run in parallel on multiprocessors</li>
                <li>When a thread blocks, scheduler can switch to another thread</li>
              </ul>
              
              <h4 className="font-medium mt-3">Disadvantages:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>More complex implementation</li>
                <li>Harder to debug and tune</li>
                <li>Scheduling decisions happen at two levels</li>
              </ul>
              
              <p className="mt-3 text-sm italic">Real-world examples: Windows ThreadPool API, Solaris LWP (Lightweight Process)</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 