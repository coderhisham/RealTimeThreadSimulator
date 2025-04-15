"use client";

import { useState } from "react";
import { Thread, useThreadStore } from "@/store/thread-store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Play, 
  Pause, 
  X, 
  SkipForward, 
  CpuIcon, 
  Database, 
  Clock, 
  RotateCw, 
  Zap, 
  ScrollText, 
  InfoIcon,
  Activity,
  Server,
  BookOpen
} from "lucide-react";
import { ThreadDialog } from "@/components/thread-dialog";
import { ResourceDialog } from "@/components/resource-dialog";
import { LogDialog } from "@/components/log-dialog";
import { ModelInfoDialog } from "@/components/model-info-dialog";
import { VisualizationDialog } from "@/components/visualization-dialog";
import { LearningDialog } from "@/components/learning-dialog";
import { Slider } from "@/components/ui/slider";

export default function ThreadManager() {
  const { 
    threads, 
    activeModel, 
    setActiveModel,
    startThread, 
    pauseThread, 
    terminateThread,
    startSimulation,
    stopSimulation,
    simulationRunning,
    simulationSpeed,
    setSimulationSpeed,
    simulationTick,
    cpuMetrics,
    resources,
    resetSimulation
  } = useThreadStore();
  
  const [isThreadDialogOpen, setIsThreadDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isModelInfoDialogOpen, setIsModelInfoDialogOpen] = useState(false);
  const [isVisualizationDialogOpen, setIsVisualizationDialogOpen] = useState(false);
  const [isLearningDialogOpen, setIsLearningDialogOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  // Status styling map
  const statusClasses = {
    ready: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    running: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    waiting: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    terminated: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  };

  // Function to format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Handle model change
  const handleModelChange = (model: string) => {
    if (simulationRunning) {
      // Stop simulation before changing model
      stopSimulation();
    }
    
    setActiveModel(model as "many-to-one" | "one-to-one" | "many-to-many");
  };

  // Model navigation cards
  const modelCards = [
    {
      title: "Many-to-One",
      icon: <Server className="h-5 w-5" />,
      description: "Multiple user threads map to a single kernel thread",
      value: "many-to-one"
    },
    {
      title: "One-to-One",
      icon: <Server className="h-5 w-5" />,
      description: "Each user thread maps directly to a kernel thread",
      value: "one-to-one"
    },
    {
      title: "Many-to-Many",
      icon: <Server className="h-5 w-5" />,
      description: "Multiple user threads map to multiple kernel threads",
      value: "many-to-many"
    }
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Thread Manager</h1>
          <div className="flex items-center mt-2 gap-2">
            <select 
              value={activeModel} 
              onChange={(e) => handleModelChange(e.target.value)}
              className="border rounded px-2 py-1 text-sm bg-background"
            >
              <option value="many-to-one">Many-to-One Model</option>
              <option value="one-to-one">One-to-One Model</option>
              <option value="many-to-many">Many-to-Many Model</option>
            </select>
            <p className="text-muted-foreground text-sm">
              Active Model: <span className="font-medium text-foreground">{activeModel.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-6 w-6"
              onClick={() => setIsModelInfoDialogOpen(true)}
            >
              <InfoIcon className="h-4 w-4" />
              <span className="sr-only">Model Information</span>
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsLearningDialogOpen(true)} 
            variant="outline" 
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Learning
          </Button>
          <Button 
            onClick={() => setIsVisualizationDialogOpen(true)} 
            variant="outline" 
            className="gap-2"
          >
            <Activity className="h-4 w-4" />
            Visualization
          </Button>
          <Button 
            onClick={() => setIsLogDialogOpen(true)} 
            variant="outline" 
            className="gap-2"
          >
            <ScrollText className="h-4 w-4" />
            System Logs
          </Button>
          <Button onClick={() => setIsResourceDialogOpen(true)} variant="outline" className="gap-2">
            <Database className="h-4 w-4" />
            Resources
          </Button>
          <Button onClick={() => {
            setSelectedThread(null);
            setIsThreadDialogOpen(true);
          }} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Thread
          </Button>
        </div>
      </div>
      
      {/* Model Selection Cards - Only shown on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:hidden">
        {modelCards.map((model) => (
          <Card 
            key={model.value} 
            className={`cursor-pointer hover:bg-accent/50 ${activeModel === model.value ? 'border-primary' : ''}`}
            onClick={() => handleModelChange(model.value)}
          >
            <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-md flex items-center gap-2">
                {model.icon}
                {model.title}
              </CardTitle>
              {activeModel === model.value && (
                <span className="bg-primary text-primary-foreground text-xs py-0.5 px-2 rounded-full">Active</span>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
      
      {/* CPU Metrics Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CpuIcon className="h-5 w-5 text-primary" />
              System Metrics
            </CardTitle>
            <div className="flex gap-3">
              <Button
                onClick={resetSimulation}
                variant="outline"
                className="gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={simulationRunning ? stopSimulation : startSimulation}
                variant={simulationRunning ? "destructive" : "default"}
                className="gap-2"
              >
                {simulationRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Stop Simulation
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Simulation
                  </>
                )}
              </Button>
              <Button
                onClick={() => simulationTick()}
                variant="outline"
                disabled={simulationRunning}
                className="gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Step
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* CPU Utilization */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
              <div className="text-sm font-medium mb-1 flex justify-between">
                <span>CPU Utilization</span>
                <span className="text-primary">{cpuMetrics.utilization.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${cpuMetrics.utilization}%` }}
                ></div>
              </div>
            </div>
            
            {/* Thread Count */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Active Threads</span>
              </div>
              <span className="text-lg font-semibold">
                {threads.filter((t) => t.status !== "terminated").length}
              </span>
            </div>
            
            {/* Context Switches */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Context Switches</span>
              </div>
              <span className="text-lg font-semibold">
                {formatNumber(cpuMetrics.contextSwitches)}
              </span>
            </div>
            
            {/* Simulation Speed */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
              <div className="text-sm font-medium mb-2 flex justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Simulation Speed
                </span>
                <span>{(1000 / simulationSpeed).toFixed(1)}x</span>
              </div>
              <div className="px-1">
                <Slider
                  value={[simulationSpeed]}
                  min={50}
                  max={1000}
                  step={50}
                  onValueChange={(value) => setSimulationSpeed(value[0])}
                  disabled={simulationRunning}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {threads.map((thread) => (
          <Card key={thread.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{thread.name}</CardTitle>
                  <CardDescription>Priority: {thread.priority}</CardDescription>
                </div>
                <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClasses[thread.status as keyof typeof statusClasses]}`}>
                  {thread.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Execution Time:</span>
                <span>{thread.executionTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Remaining Time:</span>
                <span>{thread.remainingTime}ms</span>
              </div>
              {thread.waitingFor && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Waiting For:</span>
                  <span>{resources.find((r) => r.id === thread.waitingFor)?.name || thread.waitingFor}</span>
                </div>
              )}
              
              {/* CPU Usage */}
              {thread.cpuUsage !== undefined && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>CPU Usage</span>
                    <span>{thread.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ width: `${thread.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Memory Usage */}
              {thread.memoryUsage !== undefined && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Memory</span>
                    <span>{thread.memoryUsage} MB</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${(thread.memoryUsage / 200) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="relative pt-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{Math.round(((thread.executionTime - thread.remainingTime) / thread.executionTime) * 100)}%</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                  <div 
                    className="bg-primary"
                    style={{ width: `${((thread.executionTime - thread.remainingTime) / thread.executionTime) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Stats row */}
              <div className="flex gap-3 mt-3 text-xs">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Context Switches</span>
                  <span className="font-semibold">{thread.contextSwitches || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">I/O Operations</span>
                  <span className="font-semibold">{thread.ioOperations || 0}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedThread(thread)}
                className="w-full"
                disabled={thread.status === "terminated"}
              >
                Edit
              </Button>
              <div className="flex gap-2">
                {thread.status !== "running" && thread.status !== "terminated" && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => startThread(thread.id)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                {thread.status === "running" && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => pauseThread(thread.id)}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                {thread.status !== "terminated" && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => terminateThread(thread.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ThreadDialog 
        open={isThreadDialogOpen} 
        onOpenChange={setIsThreadDialogOpen} 
        thread={selectedThread}
        onClose={() => setSelectedThread(null)}
      />
      
      <ResourceDialog
        open={isResourceDialogOpen}
        onOpenChange={setIsResourceDialogOpen}
      />
      
      <LogDialog
        open={isLogDialogOpen}
        onOpenChange={setIsLogDialogOpen}
      />
      
      <ModelInfoDialog
        open={isModelInfoDialogOpen}
        onOpenChange={setIsModelInfoDialogOpen}
      />
      
      <VisualizationDialog
        open={isVisualizationDialogOpen}
        onOpenChange={setIsVisualizationDialogOpen}
      />
      
      <LearningDialog
        open={isLearningDialogOpen}
        onOpenChange={setIsLearningDialogOpen}
      />
    </div>
  );
}
