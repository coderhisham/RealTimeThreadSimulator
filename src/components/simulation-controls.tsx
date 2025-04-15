"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useSimulationStore } from "@/store/simulation-store"
import { Play, Pause, RotateCw } from "lucide-react"

export function SimulationControls() {
  const { 
    isRunning,
    speed,
    toggleSimulation,
    setSpeed,
    resetSimulation
  } = useSimulationStore()

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
      <Button
        variant="outline" 
        size="icon"
        onClick={toggleSimulation}
        aria-label={isRunning ? "Pause simulation" : "Start simulation"}
      >
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="outline" 
        size="icon"
        onClick={resetSimulation}
        aria-label="Reset simulation"
      >
        <RotateCw className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm">Speed:</span>
        <Slider
          value={[speed]}
          min={1}
          max={10}
          step={1}
          onValueChange={(value) => setSpeed(value[0])}
          className="flex-1"
        />
        <span className="text-sm min-w-10 text-center">{speed}x</span>
      </div>
    </div>
  )
} 