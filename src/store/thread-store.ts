import { create } from "zustand";

// Core type definitions
export type ThreadStatus = "ready" | "running" | "waiting" | "terminated";
export type ThreadModel = "many-to-one" | "one-to-one" | "many-to-many";
export type ResourceType = "memory" | "file" | "network" | "device";

export interface CPUMetrics {
  utilization: number;  // 0-100%
  contextSwitches: number;
  threadCount: number;
}

export interface Thread {
  id: string;
  name: string;
  priority: number;
  status: ThreadStatus;
  createdAt: Date;
  executionTime: number; // in milliseconds
  remainingTime: number; // in milliseconds
  waitingFor?: string; // id of resource it's waiting for
  cpuUsage?: number; // 0-100%
  memoryUsage?: number; // in MB
  ioOperations?: number;
  contextSwitches?: number;
}

export interface Resource {
  id: string;
  name: string;
  inUseBy?: string;
  type: ResourceType;
}

/**
 * Thread Store State & Actions Interface
 */
interface ThreadStore {
  // State
  threads: Thread[];
  activeModel: ThreadModel;
  logs: { message: string; timestamp: Date }[];
  simulationRunning: boolean;
  simulationSpeed: number; // milliseconds per tick
  cpuMetrics: CPUMetrics;
  resources: Resource[];
  
  // Thread Actions
  setActiveModel: (model: ThreadModel) => void;
  addThread: (thread: Omit<Thread, "id" | "createdAt">) => void;
  updateThread: (id: string, updates: Partial<Omit<Thread, "id" | "createdAt">>) => void;
  removeThread: (id: string) => void;
  startThread: (id: string) => void;
  pauseThread: (id: string) => void;
  terminateThread: (id: string) => void;
  
  // Simulation Controls
  startSimulation: () => void;
  stopSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  simulationTick: () => void;
  resetSimulation: () => void;
  
  // Resource Management
  addResource: (name: string, type: ResourceType) => void;
  removeResource: (id: string) => void;
  allocateResource: (threadId: string, resourceId: string) => void;
  releaseResource: (resourceId: string) => void;
  
  // Logging
  addLog: (message: string) => void;
  clearLogs: () => void;
}

// Initial mock data
const mockThreads: Thread[] = [
  {
    id: "thread-1",
    name: "Main Thread",
    priority: 10,
    status: "running",
    createdAt: new Date(),
    executionTime: 5000,
    remainingTime: 3000,
    cpuUsage: 45,
    memoryUsage: 128,
    ioOperations: 12,
    contextSwitches: 3,
  },
  {
    id: "thread-2",
    name: "Worker Thread 1",
    priority: 5,
    status: "ready",
    createdAt: new Date(),
    executionTime: 3000,
    remainingTime: 3000,
    cpuUsage: 0,
    memoryUsage: 64,
    ioOperations: 4,
    contextSwitches: 1,
  },
  {
    id: "thread-3",
    name: "Worker Thread 2",
    priority: 5,
    status: "waiting",
    createdAt: new Date(),
    executionTime: 2000,
    remainingTime: 2000,
    waitingFor: "resource-1",
    cpuUsage: 15,
    memoryUsage: 32,
    ioOperations: 8,
    contextSwitches: 2,
  },
];

const mockResources: Resource[] = [
  { id: "resource-1", name: "File Handle", inUseBy: "thread-3", type: "file" },
  { id: "resource-2", name: "Network Socket", type: "network" },
  { id: "resource-3", name: "Database Connection", type: "device" },
];

const initialLogs = [
  { message: "System initialized", timestamp: new Date() },
  { message: "Main Thread created", timestamp: new Date() },
  { message: "Worker Thread 1 created", timestamp: new Date() },
  { message: "Worker Thread 2 created", timestamp: new Date() },
  { message: "Main Thread started execution", timestamp: new Date() },
  { message: "Worker Thread 2 waiting for resource-1", timestamp: new Date() },
];

// Interval reference stored outside the store to avoid serialization issues
let simulationInterval: NodeJS.Timeout | null = null;

/**
 * Thread Store Implementation
 * Manages thread states, resources, and simulation behavior
 */
export const useThreadStore = create<ThreadStore>((set, get) => ({
  // Initial state
  threads: [...mockThreads],
  activeModel: "many-to-one",
  logs: [...initialLogs],
  simulationRunning: false,
  simulationSpeed: 300, // 300ms per tick
  cpuMetrics: {
    utilization: 35,
    contextSwitches: 6,
    threadCount: 3,
  },
  resources: [...mockResources],
  
  // Thread model controls
  setActiveModel: (model: ThreadModel) => set({ activeModel: model }),
  
  // Thread management
  addThread: (thread: Omit<Thread, "id" | "createdAt">) => 
    set((state) => {
      const newThread: Thread = {
        ...thread,
        id: `thread-${Date.now()}`,
        createdAt: new Date(),
        cpuUsage: 0,
        memoryUsage: Math.floor(Math.random() * 100) + 20,
        ioOperations: 0,
        contextSwitches: 0,
      };
      
      return {
        threads: [...state.threads, newThread],
        logs: [
          ...state.logs,
          { message: `Thread ${thread.name} created`, timestamp: new Date() },
        ],
        cpuMetrics: {
          ...state.cpuMetrics,
          threadCount: state.cpuMetrics.threadCount + 1,
        },
      };
    }),
    
  updateThread: (id: string, updates: Partial<Omit<Thread, "id" | "createdAt">>) =>
    set((state) => ({
      threads: state.threads.map((thread) => 
        thread.id === id ? { ...thread, ...updates } : thread
      ),
    })),
    
  removeThread: (id: string) =>
    set((state) => {
      const threadToRemove = state.threads.find((t) => t.id === id);
      
      // Release any resources held by this thread
      const updatedResources = state.resources.map(resource => 
        resource.inUseBy === id ? { ...resource, inUseBy: undefined } : resource
      );
      
      return {
        threads: state.threads.filter((thread) => thread.id !== id),
        resources: updatedResources,
        logs: [
          ...state.logs,
          { 
            message: `Thread ${threadToRemove?.name || id} removed`, 
            timestamp: new Date() 
          },
        ],
        cpuMetrics: {
          ...state.cpuMetrics,
          threadCount: state.cpuMetrics.threadCount - 1,
        },
      };
    }),
    
  startThread: (id: string) =>
    set((state) => {
      const threadToStart = state.threads.find((t) => t.id === id);
      return {
        threads: state.threads.map((thread) => 
          thread.id === id 
            ? { 
                ...thread, 
                status: "running",
                cpuUsage: Math.floor(Math.random() * 40) + 20,
                contextSwitches: (thread.contextSwitches || 0) + 1,
              } 
            : thread
        ),
        logs: [
          ...state.logs,
          { 
            message: `Thread ${threadToStart?.name || id} started execution`, 
            timestamp: new Date() 
          },
        ],
        cpuMetrics: {
          ...state.cpuMetrics,
          contextSwitches: state.cpuMetrics.contextSwitches + 1,
        },
      };
    }),
    
  pauseThread: (id: string) =>
    set((state) => {
      const threadToPause = state.threads.find((t) => t.id === id);
      return {
        threads: state.threads.map((thread) => 
          thread.id === id 
            ? { 
                ...thread, 
                status: "waiting",
                cpuUsage: Math.min((thread.cpuUsage || 0) / 2, 5),
                contextSwitches: (thread.contextSwitches || 0) + 1,
              } 
            : thread
        ),
        logs: [
          ...state.logs,
          { 
            message: `Thread ${threadToPause?.name || id} paused`, 
            timestamp: new Date() 
          },
        ],
        cpuMetrics: {
          ...state.cpuMetrics,
          contextSwitches: state.cpuMetrics.contextSwitches + 1,
        },
      };
    }),
    
  terminateThread: (id: string) =>
    set((state) => {
      const threadToTerminate = state.threads.find((t) => t.id === id);
      
      // Release any resources held by this thread
      const updatedResources = state.resources.map(resource => 
        resource.inUseBy === id ? { ...resource, inUseBy: undefined } : resource
      );
      
      return {
        threads: state.threads.map((thread) => 
          thread.id === id 
            ? { 
                ...thread, 
                status: "terminated", 
                remainingTime: 0,
                cpuUsage: 0,
                contextSwitches: (thread.contextSwitches || 0) + 1,
              } 
            : thread
        ),
        resources: updatedResources,
        logs: [
          ...state.logs,
          { 
            message: `Thread ${threadToTerminate?.name || id} terminated`, 
            timestamp: new Date() 
          },
        ],
        cpuMetrics: {
          ...state.cpuMetrics,
          contextSwitches: state.cpuMetrics.contextSwitches + 1,
        },
      };
    }),
  
  // Logging
  addLog: (message: string) =>
    set((state) => ({
      logs: [
        ...state.logs,
        { message, timestamp: new Date() },
      ],
    })),
    
  clearLogs: () => set({ logs: [] }),
  
  // Simulation controls
  startSimulation: () => {
    const store = get();
    if (!store.simulationRunning) {
      set({ simulationRunning: true });
      
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
      
      simulationInterval = setInterval(() => {
        get().simulationTick();
      }, store.simulationSpeed);
      
      // Add log
      set((state) => ({
        logs: [
          ...state.logs,
          { message: "Simulation started", timestamp: new Date() },
        ],
      }));
    }
  },
  
  stopSimulation: () => {
    set({ simulationRunning: false });
    
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
    
    // Add log
    set((state) => ({
      logs: [
        ...state.logs,
        { message: "Simulation stopped", timestamp: new Date() },
      ],
    }));
  },
  
  setSimulationSpeed: (speed: number) => {
    set({ simulationSpeed: speed });
    
    // If simulation is running, restart with new speed
    const { simulationRunning } = get();
    if (simulationRunning) {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
      
      simulationInterval = setInterval(() => {
        get().simulationTick();
      }, speed);
    }
    
    // Add log
    set((state) => ({
      logs: [
        ...state.logs,
        { message: `Simulation speed set to ${speed}ms`, timestamp: new Date() },
      ],
    }));
  },
  
  // Main simulation logic
  simulationTick: () => {
    set((state) => {
      // Process threads based on model
      const updatedThreads = [...state.threads].map(thread => {
        if (thread.status === "running") {
          return processRunningThread(thread, state);
        }
        
        if (thread.status === "waiting" && thread.waitingFor) {
          return processWaitingThread(thread, state);
        }
        
        if (thread.status === "ready") {
          return processReadyThread(thread, state);
        }
        
        return thread;
      });
      
      // Calculate CPU metrics
      const runningThreads = updatedThreads.filter(t => t.status === "running");
      const totalCpuUsage = runningThreads.reduce((sum, t) => sum + (t.cpuUsage || 0), 0);
      const avgCpuUtilization = runningThreads.length > 0 
        ? totalCpuUsage / Math.max(1, runningThreads.length)
        : 0;
        
      // Calculate total context switches
      const totalSwitches = updatedThreads.reduce((sum, t) => sum + (t.contextSwitches || 0), 0);
        
      const updatedCpuMetrics = {
        ...state.cpuMetrics,
        utilization: Math.min(100, avgCpuUtilization),
        contextSwitches: totalSwitches,
      };
      
      // Log significant events based on thread changes
      logThreadStateChanges(state, updatedThreads);
      
      return {
        threads: updatedThreads,
        cpuMetrics: updatedCpuMetrics,
      };
    });
  },
  
  // Resource management
  addResource: (name: string, type: ResourceType) => 
    set((state) => {
      const newResource: Resource = {
        id: `resource-${Date.now()}`,
        name,
        type,
      };
      
      return {
        resources: [...state.resources, newResource],
        logs: [
          ...state.logs,
          { message: `Resource ${name} (${type}) added`, timestamp: new Date() },
        ],
      };
    }),
  
  removeResource: (id: string) =>
    set((state) => {
      const resourceToRemove = state.resources.find(r => r.id === id);
      
      if (resourceToRemove?.inUseBy) {
        // Update any thread waiting for this resource
        const updatedThreads = state.threads.map(thread => 
          thread.waitingFor === id
            ? { ...thread, waitingFor: undefined, status: "ready" }
            : thread
        );
        
        return {
          resources: state.resources.filter(r => r.id !== id),
          threads: updatedThreads,
          logs: [
            ...state.logs,
            { message: `Resource ${resourceToRemove.name} removed`, timestamp: new Date() },
            { message: `Threads waiting for resource released`, timestamp: new Date() },
          ],
        };
      }
      
      return {
        resources: state.resources.filter(r => r.id !== id),
        logs: [
          ...state.logs,
          { message: `Resource ${resourceToRemove?.name || id} removed`, timestamp: new Date() },
        ],
      };
    }),
  
  allocateResource: (threadId: string, resourceId: string) =>
    set((state) => {
      const thread = state.threads.find(t => t.id === threadId);
      const resource = state.resources.find(r => r.id === resourceId);
      
      if (!thread || !resource) return state;
      
      // If resource is already in use, put thread in waiting state
      if (resource.inUseBy) {
        return {
          threads: state.threads.map(t => 
            t.id === threadId
              ? { ...t, status: "waiting", waitingFor: resourceId }
              : t
          ),
          logs: [
            ...state.logs,
            { message: `Thread ${thread.name} waiting for resource ${resource.name}`, timestamp: new Date() },
          ],
        };
      }
      
      // Allocate the resource
      return {
        resources: state.resources.map(r => 
          r.id === resourceId ? { ...r, inUseBy: threadId } : r
        ),
        logs: [
          ...state.logs,
          { message: `Resource ${resource.name} allocated to thread ${thread.name}`, timestamp: new Date() },
        ],
      };
    }),
  
  releaseResource: (resourceId: string) =>
    set((state) => {
      const resource = state.resources.find(r => r.id === resourceId);
      
      if (!resource || !resource.inUseBy) return state;
      
      const thread = state.threads.find(t => t.id === resource.inUseBy);
      
      return {
        resources: state.resources.map(r => 
          r.id === resourceId ? { ...r, inUseBy: undefined } : r
        ),
        threads: state.threads.map(t => 
          t.id === resource.inUseBy && t.waitingFor === resourceId
            ? { ...t, status: "ready", waitingFor: undefined }
            : t
        ),
        logs: [
          ...state.logs,
          { message: `Resource ${resource.name} released${thread ? ` by thread ${thread.name}` : ''}`, timestamp: new Date() },
        ],
      };
    }),
  
  // Reset simulation - add this method
  resetSimulation: () => {
    // Clear any running simulation
    if (get().simulationRunning) {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
    }
    
    // Reset to initial state
    set({
      threads: [...mockThreads],
      logs: [
        { message: "System reset", timestamp: new Date() },
        ...initialLogs
      ],
      simulationRunning: false,
      cpuMetrics: {
        utilization: 35,
        contextSwitches: 6,
        threadCount: 3,
      },
      resources: [...mockResources],
    });
  },
}));

// Helper functions for simulation logic to improve readability

/**
 * Process a thread in running state
 */
function processRunningThread(thread: Thread, state: ThreadStore): Thread {
  // Reduce remaining time
  const newRemainingTime = Math.max(0, thread.remainingTime - state.simulationSpeed);
  
  // Thread completed execution?
  if (newRemainingTime === 0) {
    return {
      ...thread,
      remainingTime: 0,
      status: "terminated",
      cpuUsage: 0,
    };
  }
  
  // Random IO chances based on model
  const ioChance = state.activeModel === "many-to-one" ? 0.1 : 
                  state.activeModel === "one-to-one" ? 0.15 : 0.05;
                  
  // Random chance to do I/O operation
  if (Math.random() < ioChance && state.resources.some(r => !r.inUseBy)) {
    // Find available resource
    const availableResources = state.resources.filter(r => !r.inUseBy);
    if (availableResources.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableResources.length);
      const resource = availableResources[randomIndex];
      
      // Update resources list (this is mutating state, but in Zustand it's okay within actions)
      state.resources = state.resources.map(r => 
        r.id === resource.id ? { ...r, inUseBy: thread.id } : r
      );
      
      return {
        ...thread,
        status: "waiting",
        waitingFor: resource.id,
        remainingTime: newRemainingTime,
        cpuUsage: Math.floor((thread.cpuUsage || 20) / 3),
        ioOperations: (thread.ioOperations || 0) + 1,
      };
    }
  }
  
  // Random CPU fluctuations
  const cpuDelta = Math.floor(Math.random() * 10) - 4;
  const newCpuUsage = Math.max(10, Math.min(95, (thread.cpuUsage || 30) + cpuDelta));
  
  // Random memory fluctuations
  const memDelta = Math.floor(Math.random() * 6) - 2;
  const newMemUsage = Math.max(5, (thread.memoryUsage || 50) + memDelta);
  
  return {
    ...thread,
    remainingTime: newRemainingTime,
    cpuUsage: newCpuUsage,
    memoryUsage: newMemUsage,
  };
}

/**
 * Process a thread in waiting state
 */
function processWaitingThread(thread: Thread, state: ThreadStore): Thread {
  // Random chance to complete I/O based on model
  const ioCompleteChance = state.activeModel === "many-to-one" ? 0.05 : 
                         state.activeModel === "one-to-one" ? 0.2 : 0.15;
                         
  if (Math.random() < ioCompleteChance && thread.waitingFor) {
    // Free the resource
    state.resources = state.resources.map(r => 
      r.id === thread.waitingFor ? { ...r, inUseBy: undefined } : r
    );
    
    return {
      ...thread,
      status: "running",
      waitingFor: undefined,
      cpuUsage: Math.floor(Math.random() * 40) + 30,
      contextSwitches: (thread.contextSwitches || 0) + 1,
    };
  }
  
  return thread;
}

/**
 * Process a thread in ready state
 */
function processReadyThread(thread: Thread, state: ThreadStore): Thread {
  // Scheduling behavior based on model
  switch (state.activeModel) {
    case "many-to-one":
      // Only start if no other thread is running
      if (!state.threads.some(t => t.status === "running")) {
        return {
          ...thread,
          status: "running",
          cpuUsage: Math.floor(Math.random() * 40) + 30,
          contextSwitches: (thread.contextSwitches || 0) + 1,
        };
      }
      break;
      
    case "one-to-one":
      // Can start any time based on priority
      const startChance = thread.priority / 20; // 0.05 to 0.5
      if (Math.random() < startChance) {
        return {
          ...thread,
          status: "running",
          cpuUsage: Math.floor(Math.random() * 40) + 30,
          contextSwitches: (thread.contextSwitches || 0) + 1,
        };
      }
      break;
      
    case "many-to-many":
      // Medium chance to start
      if (Math.random() < 0.25) {
        return {
          ...thread,
          status: "running",
          cpuUsage: Math.floor(Math.random() * 40) + 30,
          contextSwitches: (thread.contextSwitches || 0) + 1,
        };
      }
      break;
  }
  
  return thread;
}

/**
 * Log significant thread state changes
 */
function logThreadStateChanges(state: ThreadStore, updatedThreads: Thread[]): void {
  const { addLog } = useThreadStore.getState();
  
  // Detect running thread changes
  const runningBefore = state.threads.filter(t => t.status === "running");
  const runningAfter = updatedThreads.filter(t => t.status === "running");
  
  // New terminated threads
  const newlyTerminated = updatedThreads.filter(t => 
    t.status === "terminated" && 
    state.threads.find(ot => ot.id === t.id && ot.status !== "terminated")
  );
  
  // Log new terminations
  newlyTerminated.forEach(t => {
    addLog(`Thread ${t.name} completed execution`);
  });
  
  // Log scheduling events
  if (runningBefore.length === 0 && runningAfter.length > 0) {
    addLog(`CPU scheduling started - ${runningAfter.length} thread(s) now running`);
  }
  
  // Check for deadlock (all threads waiting and none running)
  const allThreadsWaiting = updatedThreads.every(t => 
    t.status === "waiting" || t.status === "terminated"
  );
  
  if (allThreadsWaiting && updatedThreads.some(t => t.status === "waiting")) {
    addLog("WARNING: Potential deadlock detected - all threads waiting");
  }
} 