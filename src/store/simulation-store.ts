import { create } from 'zustand'

interface SimulationState {
  isRunning: boolean
  speed: number
  toggleSimulation: () => void
  setSpeed: (speed: number) => void
  resetSimulation: () => void
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isRunning: false,
  speed: 5,
  
  toggleSimulation: () => set((state) => ({ isRunning: !state.isRunning })),
  
  setSpeed: (speed) => set({ speed }),
  
  resetSimulation: () => set({ isRunning: false }),
})) 