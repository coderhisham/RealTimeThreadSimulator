"use client";

import React, { useState } from "react";

interface ThreadingModelDiagramProps {
  model: "one-to-one" | "many-to-one" | "many-to-many";
}

export function ThreadingModelDiagram({ model }: ThreadingModelDiagramProps) {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  
  if (model === "one-to-one") {
    return (
      <svg width="300" height="250" viewBox="0 0 300 250" className="border rounded-md bg-white dark:bg-slate-800 p-2">
        {/* One-to-One Model Diagram */}
        
        {/* User Threads */}
        <g 
          onMouseEnter={() => setHoveredElement("ut1")}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x="30" y="30" width="50" height="40" rx="4" 
            fill={hoveredElement === "ut1" ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.8)"}
            style={{ transition: "fill 0.2s ease" }}
          />
          <text x="55" y="55" textAnchor="middle" fill="white" fontWeight="bold">UT1</text>
        </g>
        <g 
          onMouseEnter={() => setHoveredElement("ut2")}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x="120" y="30" width="50" height="40" rx="4" 
            fill={hoveredElement === "ut2" ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.8)"}
            style={{ transition: "fill 0.2s ease" }}
          />
          <text x="145" y="55" textAnchor="middle" fill="white" fontWeight="bold">UT2</text>
        </g>
        <g 
          onMouseEnter={() => setHoveredElement("ut3")}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x="210" y="30" width="50" height="40" rx="4" 
            fill={hoveredElement === "ut3" ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.8)"}
            style={{ transition: "fill 0.2s ease" }}
          />
          <text x="235" y="55" textAnchor="middle" fill="white" fontWeight="bold">UT3</text>
        </g>
        
        {/* Connection Lines */}
        <line 
          x1="55" y1="70" x2="55" y2="150" 
          stroke={hoveredElement === "ut1" || hoveredElement === "kt1" ? "#000" : "#6b7280"} 
          strokeWidth={hoveredElement === "ut1" || hoveredElement === "kt1" ? "3" : "2"}
          style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
        />
        <line 
          x1="145" y1="70" x2="145" y2="150" 
          stroke={hoveredElement === "ut2" || hoveredElement === "kt2" ? "#000" : "#6b7280"} 
          strokeWidth={hoveredElement === "ut2" || hoveredElement === "kt2" ? "3" : "2"}
          style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
        />
        <line 
          x1="235" y1="70" x2="235" y2="150" 
          stroke={hoveredElement === "ut3" || hoveredElement === "kt3" ? "#000" : "#6b7280"} 
          strokeWidth={hoveredElement === "ut3" || hoveredElement === "kt3" ? "3" : "2"}
          style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
        />
        
        {/* Kernel Threads */}
        <g 
          onMouseEnter={() => setHoveredElement("kt1")}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x="30" y="150" width="50" height="40" rx="4" 
            fill={hoveredElement === "kt1" ? "#2563eb" : "#3b82f6"}
            style={{ transition: "fill 0.2s ease" }}
          />
          <text x="55" y="175" textAnchor="middle" fill="white" fontWeight="bold">KT1</text>
        </g>
        <g 
          onMouseEnter={() => setHoveredElement("kt2")}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x="120" y="150" width="50" height="40" rx="4" 
            fill={hoveredElement === "kt2" ? "#2563eb" : "#3b82f6"}
            style={{ transition: "fill 0.2s ease" }}
          />
          <text x="145" y="175" textAnchor="middle" fill="white" fontWeight="bold">KT2</text>
        </g>
        <g 
          onMouseEnter={() => setHoveredElement("kt3")}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x="210" y="150" width="50" height="40" rx="4" 
            fill={hoveredElement === "kt3" ? "#2563eb" : "#3b82f6"}
            style={{ transition: "fill 0.2s ease" }}
          />
          <text x="235" y="175" textAnchor="middle" fill="white" fontWeight="bold">KT3</text>
        </g>
        
        {/* Legend */}
        <g>
          <rect x="100" y="210" width="10" height="10" fill="hsl(var(--primary) / 0.8)" />
          <text x="115" y="220" textAnchor="start" fill="currentColor" fontSize="12">User Thread</text>
          <rect x="180" y="210" width="10" height="10" fill="#3b82f6" />
          <text x="195" y="220" textAnchor="start" fill="currentColor" fontSize="12">Kernel Thread</text>
        </g>
      </svg>
    );
  }
  
  if (model === "many-to-one") {
    return (
      <svg width="300" height="250" viewBox="0 0 300 250" className="border rounded-md bg-white dark:bg-slate-800 p-2">
        {/* Many-to-One Model Diagram */}
        
        {/* User Threads */}
        {[1, 2, 3, 4, 5].map((i) => (
          <g 
            key={`ut${i}`}
            onMouseEnter={() => setHoveredElement(`ut${i}`)}
            onMouseLeave={() => setHoveredElement(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect 
              x={20 + (i-1)*50} y="30" width="40" height="35" rx="4" 
              fill={hoveredElement === `ut${i}` ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.8)"}
              style={{ transition: "fill 0.2s ease" }}
            />
            <text x={40 + (i-1)*50} y="52" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">UT{i}</text>
          </g>
        ))}
        
        {/* Connection Lines */}
        <line 
          x1="40" y1="65" x2="120" y2="110" 
          stroke={hoveredElement === "ut1" || hoveredElement === "manager" ? "#000" : "#6b7280"} 
          strokeWidth={hoveredElement === "ut1" || hoveredElement === "manager" ? "3" : "2"}
          style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
        />
        <line 
          x1="90" y1="65" x2="125" y2="110" 
          stroke={hoveredElement === "ut2" || hoveredElement === "manager" ? "#000" : "#6b7280"} 
          strokeWidth={hoveredElement === "ut2" || hoveredElement === "manager" ? "3" : "2"}
          style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
        />
        <line 
          x1="140" y1="65" x2="140" y2="110" 
          stroke={hoveredElement === "ut3" || hoveredElement === "manager" ? "#000" : "#6b7280"} 
          strokeWidth={hoveredElement === "ut3" || hoveredElement === "manager" ? "3" : "2"}
          style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
        />
        <line 
          x1="190" y1="65" x2="155" y2="110" 
          stroke={hoveredElement === "ut4" || hoveredElement === "manager" ? "#000" : "#6b7280"} 
          strokeWidth={hoveredElement === "ut4" || hoveredElement === "manager" ? "3" : "2"}
          style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
        />
        <line 
          x1="240" y1="65" x2="160" y2="110" 
          stroke={hoveredElement === "ut5" || hoveredElement === "manager" ? "#000" : "#6b7280"} 
          strokeWidth={hoveredElement === "ut5" || hoveredElement === "manager" ? "3" : "2"}
          style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
        />
        
        {/* Thread Manager */}
        <g
          onMouseEnter={() => setHoveredElement("manager")}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x="100" y="110" width="100" height="35" rx="4" 
            fill={hoveredElement === "manager" ? "#ca8a04" : "#eab308"}
            style={{ transition: "fill 0.2s ease" }}
          />
          <text x="150" y="132" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">Thread Manager</text>
        </g>
        
        {/* Connection to Kernel Thread */}
        <line 
          x1="150" y1="145" x2="150" y2="170" 
          stroke={hoveredElement === "manager" || hoveredElement === "kt" ? "#000" : "#6b7280"} 
          strokeWidth={hoveredElement === "manager" || hoveredElement === "kt" ? "3" : "2"}
          style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
        />
        
        {/* Kernel Thread */}
        <g
          onMouseEnter={() => setHoveredElement("kt")}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x="125" y="170" width="50" height="40" rx="4" 
            fill={hoveredElement === "kt" ? "#2563eb" : "#3b82f6"}
            style={{ transition: "fill 0.2s ease" }}
          />
          <text x="150" y="195" textAnchor="middle" fill="white" fontWeight="bold">KT</text>
        </g>
        
        {/* Legend */}
        <g>
          <rect x="20" y="220" width="10" height="10" fill="hsl(var(--primary) / 0.8)" />
          <text x="35" y="230" textAnchor="start" fill="currentColor" fontSize="12">User Thread</text>
          <rect x="110" y="220" width="10" height="10" fill="#eab308" />
          <text x="125" y="230" textAnchor="start" fill="currentColor" fontSize="12">Thread Manager</text>
          <rect x="220" y="220" width="10" height="10" fill="#3b82f6" />
          <text x="235" y="230" textAnchor="start" fill="currentColor" fontSize="12">Kernel Thread</text>
        </g>
      </svg>
    );
  }
  
  // Many-to-Many model
  return (
    <svg width="300" height="280" viewBox="0 0 300 280" className="border rounded-md bg-white dark:bg-slate-800 p-2">
      {/* Many-to-Many Model Diagram */}
      
      {/* User Threads */}
      {[1, 2, 3, 4, 5].map((i) => (
        <g 
          key={`ut${i}`}
          onMouseEnter={() => setHoveredElement(`ut${i}`)}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x={20 + (i-1)*50} y="30" width="40" height="35" rx="4" 
            fill={hoveredElement === `ut${i}` ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.8)"}
            style={{ transition: "fill 0.2s ease" }}
          />
          <text x={40 + (i-1)*50} y="52" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">UT{i}</text>
        </g>
      ))}
      
      {/* Connection Paths */}
      <path 
        d="M 40,65 C 40,90 120,100 150,110" 
        stroke={hoveredElement === "ut1" || hoveredElement === "mapper" ? "#000" : "#6b7280"} 
        strokeWidth={hoveredElement === "ut1" || hoveredElement === "mapper" ? "3" : "2"}
        fill="none" 
        style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
      />
      <path 
        d="M 90,65 C 90,85 130,100 150,110" 
        stroke={hoveredElement === "ut2" || hoveredElement === "mapper" ? "#000" : "#6b7280"} 
        strokeWidth={hoveredElement === "ut2" || hoveredElement === "mapper" ? "3" : "2"}
        fill="none" 
        style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
      />
      <path 
        d="M 140,65 C 140,80 145,100 150,110" 
        stroke={hoveredElement === "ut3" || hoveredElement === "mapper" ? "#000" : "#6b7280"} 
        strokeWidth={hoveredElement === "ut3" || hoveredElement === "mapper" ? "3" : "2"}
        fill="none" 
        style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
      />
      <path 
        d="M 190,65 C 190,80 155,100 150,110" 
        stroke={hoveredElement === "ut4" || hoveredElement === "mapper" ? "#000" : "#6b7280"} 
        strokeWidth={hoveredElement === "ut4" || hoveredElement === "mapper" ? "3" : "2"}
        fill="none" 
        style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
      />
      <path 
        d="M 240,65 C 240,85 170,100 150,110" 
        stroke={hoveredElement === "ut5" || hoveredElement === "mapper" ? "#000" : "#6b7280"} 
        strokeWidth={hoveredElement === "ut5" || hoveredElement === "mapper" ? "3" : "2"}
        fill="none" 
        style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
      />
      
      {/* Thread Mapper */}
      <g
        onMouseEnter={() => setHoveredElement("mapper")}
        onMouseLeave={() => setHoveredElement(null)}
        style={{ cursor: 'pointer' }}
      >
        <rect 
          x="100" y="110" width="100" height="35" rx="4" 
          fill={hoveredElement === "mapper" ? "#ca8a04" : "#eab308"}
          style={{ transition: "fill 0.2s ease" }}
        />
        <text x="150" y="132" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">Thread Mapper</text>
      </g>
      
      {/* Connection to Kernel Threads */}
      <path 
        d="M 150,145 C 150,160 70,170 70,190" 
        stroke={hoveredElement === "mapper" || hoveredElement === "kt1" ? "#000" : "#6b7280"}
        strokeWidth={hoveredElement === "mapper" || hoveredElement === "kt1" ? "3" : "2"}
        fill="none" 
        style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
      />
      <path 
        d="M 150,145 C 150,160 150,170 150,190" 
        stroke={hoveredElement === "mapper" || hoveredElement === "kt2" ? "#000" : "#6b7280"}
        strokeWidth={hoveredElement === "mapper" || hoveredElement === "kt2" ? "3" : "2"}
        fill="none" 
        style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
      />
      <path 
        d="M 150,145 C 150,160 230,170 230,190" 
        stroke={hoveredElement === "mapper" || hoveredElement === "kt3" ? "#000" : "#6b7280"}
        strokeWidth={hoveredElement === "mapper" || hoveredElement === "kt3" ? "3" : "2"}
        fill="none" 
        style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
      />
      
      {/* Kernel Threads */}
      <g
        onMouseEnter={() => setHoveredElement("kt1")}
        onMouseLeave={() => setHoveredElement(null)}
        style={{ cursor: 'pointer' }}
      >
        <rect 
          x="45" y="190" width="50" height="40" rx="4" 
          fill={hoveredElement === "kt1" ? "#2563eb" : "#3b82f6"}
          style={{ transition: "fill 0.2s ease" }}
        />
        <text x="70" y="215" textAnchor="middle" fill="white" fontWeight="bold">KT1</text>
      </g>
      <g
        onMouseEnter={() => setHoveredElement("kt2")}
        onMouseLeave={() => setHoveredElement(null)}
        style={{ cursor: 'pointer' }}
      >
        <rect 
          x="125" y="190" width="50" height="40" rx="4" 
          fill={hoveredElement === "kt2" ? "#2563eb" : "#3b82f6"}
          style={{ transition: "fill 0.2s ease" }}
        />
        <text x="150" y="215" textAnchor="middle" fill="white" fontWeight="bold">KT2</text>
      </g>
      <g
        onMouseEnter={() => setHoveredElement("kt3")}
        onMouseLeave={() => setHoveredElement(null)}
        style={{ cursor: 'pointer' }}
      >
        <rect 
          x="205" y="190" width="50" height="40" rx="4" 
          fill={hoveredElement === "kt3" ? "#2563eb" : "#3b82f6"}
          style={{ transition: "fill 0.2s ease" }}
        />
        <text x="230" y="215" textAnchor="middle" fill="white" fontWeight="bold">KT3</text>
      </g>
      
      {/* Legend */}
      <g>
        <rect x="20" y="245" width="10" height="10" fill="hsl(var(--primary) / 0.8)" />
        <text x="35" y="255" textAnchor="start" fill="currentColor" fontSize="12">User Thread</text>
        <rect x="110" y="245" width="10" height="10" fill="#eab308" />
        <text x="125" y="255" textAnchor="start" fill="currentColor" fontSize="12">Thread Mapper</text>
        <rect x="210" y="245" width="10" height="10" fill="#3b82f6" />
        <text x="225" y="255" textAnchor="start" fill="currentColor" fontSize="12">Kernel Thread</text>
      </g>
    </svg>
  );
} 