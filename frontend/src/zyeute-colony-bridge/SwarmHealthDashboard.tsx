/**
 * 📊 Swarm Health Dashboard - Real-time Colony OS Monitoring
 *
 * Displays:
 * - Circuit breaker states for all services
 * - Task queue depth
 * - Bee activity status
 * - Error rates and performance metrics
 */

import React, { useEffect, useState } from "react";
import { tiGuySwarm } from "./TiGuySwarmAdapter";
import {
  deepSeekCircuit,
  swarmCircuit,
  supabaseCircuit,
} from "./CircuitBreaker";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface CircuitStatus {
  name: string;
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  failures: number;
  totalRequests: number;
  totalFailures: number;
  totalSuccesses: number;
}

interface SwarmHealth {
  circuits: CircuitStatus[];
  mode: string;
  lastUpdate: Date;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export function SwarmHealthDashboard() {
  const [health, setHealth] = useState<SwarmHealth | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Refresh health status every 5 seconds
  useEffect(() => {
    const updateHealth = () => {
      const tiGuyHealth = tiGuySwarm.getHealthStatus();

      const circuits: CircuitStatus[] = [
        {
          name: "DeepSeek API",
          ...deepSeekCircuit.getStats(),
        },
        {
          name: "Colony Swarm",
          ...swarmCircuit.getStats(),
        },
        {
          name: "Supabase",
          ...supabaseCircuit.getStats(),
        },
      ];

      setHealth({
        circuits,
        mode: tiGuyHealth.mode,
        lastUpdate: new Date(),
      });
    };

    updateHealth();
    const interval = setInterval(updateHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!health) return null;

  // Calculate overall status
  const hasOpenCircuit = health.circuits.some((c) => c.state === "OPEN");
  const hasHalfOpen = health.circuits.some((c) => c.state === "HALF_OPEN");
  const overallStatus = hasOpenCircuit
    ? "degraded"
    : hasHalfOpen
      ? "recovering"
      : "healthy";

  // Status colors
  const statusColors = {
    healthy: "bg-green-500",
    recovering: "bg-yellow-500",
    degraded: "bg-red-500",
  };

  const circuitColors = {
    CLOSED: "text-green-400",
    HALF_OPEN: "text-yellow-400",
    OPEN: "text-red-400",
  };

  const circuitIcons = {
    CLOSED: "✅",
    HALF_OPEN: "🟡",
    OPEN: "🔴",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Compact Status Indicator */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full
          bg-gray-900/90 backdrop-blur-sm border border-gray-700
          hover:border-gray-600 transition-all
          ${isExpanded ? "rounded-b-none border-b-0" : ""}
        `}
      >
        <div
          className={`w-2 h-2 rounded-full ${statusColors[overallStatus]} animate-pulse`}
        />
        <span className="text-sm text-gray-300">
          🐝 Swarm:{" "}
          {overallStatus === "healthy"
            ? "Tiguidou"
            : overallStatus === "recovering"
              ? "En récupération"
              : "Dégradé"}
        </span>
        <span className="text-xs text-gray-500">{isExpanded ? "▼" : "▲"}</span>
      </button>

      {/* Expanded Dashboard */}
      {isExpanded && (
        <div
          className="
          w-80 p-4 
          bg-gray-900/95 backdrop-blur-sm 
          border border-gray-700 border-t-0 rounded-b-lg
          shadow-xl
        "
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
            <h3 className="text-sm font-bold text-amber-400">
              📊 Colony OS Health
            </h3>
            <span className="text-xs text-gray-500">
              Mode: {health.mode === "local" ? "🏠 Local" : "☁️ API"}
            </span>
          </div>

          {/* Circuit Breakers */}
          <div className="space-y-2 mb-3">
            {health.circuits.map((circuit) => (
              <div
                key={circuit.name}
                className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
              >
                <div className="flex items-center gap-2">
                  <span>{circuitIcons[circuit.state]}</span>
                  <span className="text-sm text-gray-300">{circuit.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${circuitColors[circuit.state]}`}>
                    {circuit.state}
                  </span>
                  {circuit.failures > 0 && (
                    <span className="text-xs text-red-400">
                      ({circuit.failures} fails)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-gray-800/30 rounded">
              <div className="text-lg font-bold text-green-400">
                {health.circuits.reduce((sum, c) => sum + c.totalSuccesses, 0)}
              </div>
              <div className="text-xs text-gray-500">Succès</div>
            </div>
            <div className="p-2 bg-gray-800/30 rounded">
              <div className="text-lg font-bold text-red-400">
                {health.circuits.reduce((sum, c) => sum + c.totalFailures, 0)}
              </div>
              <div className="text-xs text-gray-500">Erreurs</div>
            </div>
            <div className="p-2 bg-gray-800/30 rounded">
              <div className="text-lg font-bold text-blue-400">
                {health.circuits.reduce((sum, c) => sum + c.totalRequests, 0)}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>

          {/* Last Update */}
          <div className="mt-3 pt-2 border-t border-gray-700 text-center">
            <span className="text-xs text-gray-500">
              Mis à jour: {health.lastUpdate.toLocaleTimeString("es-MX")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SwarmHealthDashboard;
