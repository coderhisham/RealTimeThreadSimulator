# Thread Simulation App

This application provides a visual simulation of different threading models commonly used in operating systems. It helps users understand the differences between various thread management approaches and observe how they behave in real time.

## Learning Features

To make threading concepts easier to understand, this application includes several learning-focused features:

- **Interactive Tutorial**: Step-by-step guide explaining threading concepts with visual diagrams
- **Thread State Visualization**: See threads change states in real-time with color-coded status indicators
- **Model Comparison**: Visual diagrams showing the differences between threading models with examples
- **Resource Management**: Experience deadlocks and resource contention firsthand
- **Guided Practice Scenarios**: Follow structured exercises to understand specific concepts
- **Event Logging**: Track important events like context switches and resource allocation

## New Educational Components

We've added several components specifically designed to make threading concepts more accessible:

1. **Model Explanation Diagrams**: Visual SVG diagrams showing how user threads map to kernel threads in each model
2. **Thread State Transition Diagram**: Interactive state diagram showing how threads move between states
3. **Tutorial Page**: Comprehensive guide with tabs for different aspects of threading
4. **Practice Scenarios**: Structured exercises that demonstrate key threading concepts

## Thread Store

The core of this application is the thread store, which manages the state and behavior of threads, resources, and the simulation itself.

### Overview

The thread store is implemented using Zustand, a lightweight state management library for React. It maintains:

- Thread data (status, execution time, resource usage, etc.)
- Resource allocation and management
- Simulation controls (start/stop, speed)
- Logging of important events
- CPU metrics and statistics

### Threading Models

The app simulates three main threading models:

1. **Many-to-One (User-Level Threading)**
   - Multiple user threads map to a single kernel thread
   - Fast thread creation and context switching
   - Limited concurrency (only one thread runs at a time)
   - When a thread blocks on I/O, all threads block
   - **Real-world example**: Early Java thread implementation

2. **One-to-One (Kernel-Level Threading)**
   - Each user thread maps directly to a kernel thread
   - Better parallelism
   - Higher overhead for thread creation
   - Thread scheduling is handled by the kernel
   - **Real-world example**: Linux NPTL (Native POSIX Thread Library)

3. **Many-to-Many (Hybrid Threading)**
   - Multiple user threads multiplexed to multiple kernel threads
   - Combines benefits of both models
   - More complex implementation
   - Provides both parallelism and efficiency
   - **Real-world example**: Windows ThreadPool API, Solaris LWP

### Understanding Thread States

Threads can be in one of four states:

- **Ready** (yellow): Thread is waiting to be executed
- **Running** (green): Thread is currently executing
- **Waiting** (blue): Thread is blocked, waiting for a resource or I/O operation
- **Terminated** (red): Thread has completed execution

The simulation demonstrates how threads transition between these states based on the scheduling algorithm, resource availability, and I/O operations.

### How to Use

#### Managing Threads

```typescript
import { useThreadStore } from "@/store/thread-store";

// Access the store in your component
const { threads, addThread, startThread, pauseThread, terminateThread } = useThreadStore();

// Create a new thread
addThread({
  name: "My Thread",
  priority: 5,
  status: "ready",
  executionTime: 3000,
  remainingTime: 3000
});

// Control threads
startThread("thread-id");
pauseThread("thread-id");
terminateThread("thread-id");
```

#### Working with Resources

```typescript
const { resources, addResource, allocateResource, releaseResource } = useThreadStore();

// Add a new resource
addResource("Database Connection", "device");

// Allocate resource to thread
allocateResource("thread-id", "resource-id");

// Release resource
releaseResource("resource-id");
```

#### Controlling the Simulation

```typescript
const { 
  startSimulation, 
  stopSimulation, 
  setSimulationSpeed,
  simulationTick, // for step-by-step execution
  simulationRunning
} = useThreadStore();

// Start/stop the simulation
startSimulation();
stopSimulation();

// Adjust simulation speed (in milliseconds per tick)
setSimulationSpeed(300); // Default speed
setSimulationSpeed(100); // Faster
setSimulationSpeed(1000); // Slower

// Manual stepping (when simulation is stopped)
simulationTick();
```

#### Accessing Metrics and Logs

```typescript
const { cpuMetrics, logs, clearLogs } = useThreadStore();

// CPU metrics include:
// - utilization (percentage)
// - contextSwitches (count)
// - threadCount (active threads)

// Logs record important events during simulation
// Each log has a message and timestamp
```

## How The Simulation Works

The simulation works by:

1. Each "tick" processes all threads based on their status
2. Running threads:
   - Reduce remaining execution time
   - Have random CPU/memory fluctuations
   - May request resources and enter waiting state
   - Complete when remaining time reaches zero

3. Waiting threads:
   - Wait for I/O operation completion
   - Have a chance to complete I/O and return to running state
   - The completion chance varies by thread model

4. Ready threads:
   - May be scheduled based on the active thread model
   - Many-to-One: Only run if no other thread is running
   - One-to-One: Can start based on priority
   - Many-to-Many: Medium chance to start

5. Deadlock detection:
   - Monitors when all threads are waiting for resources
   - Logs warnings when potential deadlocks are detected

## Interactive Learning Scenarios

Try these scenarios to understand specific aspects of threading:

### 1. Deadlock Demonstration
1. Create 2-3 threads with similar priorities
2. Add 2-3 resources (different types)
3. Start the simulation
4. Watch as threads request resources and eventually deadlock
5. Check the logs to see the deadlock warning

### 2. Context Switch Overhead
1. Create several threads with high priority
2. Set the model to One-to-One
3. Start simulation and observe context switch count
4. Switch to Many-to-One model
5. Compare the performance differences

### 3. Resource Contention
1. Create multiple threads (5+)
2. Add only 1-2 resources
3. Start the simulation
4. Observe how threads wait for resources
5. Notice how different models handle the contention

### 4. Priority Scheduling
1. Create threads with various priorities
2. Set model to One-to-One
3. Start the simulation
4. Observe how higher priority threads get scheduled more frequently

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
