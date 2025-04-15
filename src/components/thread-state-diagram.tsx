"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ThreadStateDiagram() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thread State Transitions</CardTitle>
        <CardDescription>
          How threads move between different states during execution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-2xl mx-auto h-[400px]">
          {/* SVG State Diagram */}
          <svg width="100%" height="100%" viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            {/* State Circles */}
            {/* Ready State */}
            <circle cx="120" cy="175" r="50" fill="#fef08a" stroke="#eab308" strokeWidth="2" />
            <text x="120" y="175" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold">READY</text>
            
            {/* Running State */}
            <circle cx="300" cy="70" r="50" fill="#86efac" stroke="#22c55e" strokeWidth="2" />
            <text x="300" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold">RUNNING</text>
            
            {/* Waiting State */}
            <circle cx="300" cy="280" r="50" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
            <text x="300" y="280" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold">WAITING</text>
            
            {/* Terminated State */}
            <circle cx="480" cy="175" r="50" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
            <text x="480" y="175" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold">TERMINATED</text>
            
            {/* Arrows */}
            {/* New to Ready */}
            <path d="M30,175 L60,175" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <text x="45" y="165" textAnchor="middle" fontSize="12">Create</text>

            {/* Ready to Running */}
            <path d="M155,140 C190,90 230,70 255,70" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <text x="200" y="55" textAnchor="middle" fontSize="12">Scheduler Dispatch</text>
            
            {/* Running to Ready (Timeout) */}
            <path d="M255,100 C230,130 190,140 155,140" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <text x="200" y="135" textAnchor="middle" fontSize="12">Time Quantum Expired</text>
            
            {/* Running to Waiting */}
            <path d="M300,130 L300,220" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <text x="315" y="175" textAnchor="start" fontSize="12">I/O or Resource Request</text>
            
            {/* Waiting to Ready */}
            <path d="M255,280 C210,280 170,220 155,210" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <text x="180" y="255" textAnchor="middle" fontSize="12">I/O or Resource Available</text>
            
            {/* Running to Terminated */}
            <path d="M350,80 C410,90 430,130 440,150" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <text x="420" y="100" textAnchor="middle" fontSize="12">Execution Complete</text>
            
            {/* Markers */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            
            {/* Legend */}
            <rect x="20" y="310" width="15" height="15" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
            <text x="45" y="322" fontSize="12" dominantBaseline="middle">Ready - Thread is waiting to be executed</text>
            
            <rect x="180" y="310" width="15" height="15" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
            <text x="205" y="322" fontSize="12" dominantBaseline="middle">Running - Thread is currently executing</text>
            
            <rect x="20" y="335" width="15" height="15" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" />
            <text x="45" y="347" fontSize="12" dominantBaseline="middle">Waiting - Thread is blocked (I/O or resource)</text>
            
            <rect x="180" y="335" width="15" height="15" fill="#fca5a5" stroke="#ef4444" strokeWidth="1" />
            <text x="205" y="347" fontSize="12" dominantBaseline="middle">Terminated - Thread has completed execution</text>
          </svg>
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Understanding Thread Lifecycle</h3>
          <p>The diagram above shows how threads transition between different states:</p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Ready → Running</h4>
            <p className="text-sm">When the scheduler selects a thread for execution, it moves from Ready to Running state. This is when the thread actually gets CPU time.</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Running → Waiting</h4>
            <p className="text-sm">When a running thread requests an I/O operation or needs a resource that's unavailable, it enters the Waiting state and releases the CPU.</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Waiting → Ready</h4>
            <p className="text-sm">When the I/O operation completes or the requested resource becomes available, the thread moves back to Ready state, where it waits to be scheduled again.</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Running → Ready</h4>
            <p className="text-sm">The scheduler may preempt a running thread when its time quantum expires, moving it back to Ready state to give other threads a chance to execute.</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Running → Terminated</h4>
            <p className="text-sm">When a thread completes its execution or is explicitly terminated, it enters the Terminated state, releasing all resources.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 