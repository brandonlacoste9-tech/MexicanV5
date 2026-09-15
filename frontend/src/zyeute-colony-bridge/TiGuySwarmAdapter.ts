import { colonyClient } from "./ColonyClient";
import { BeeType, SwarmResponse } from "./types";
import { deepSeekCircuit, swarmCircuit } from "./CircuitBreaker";
import {
  processMexicanoTask,
  generateMexicanoResponse,
  mexicanoify,
} from "@/services/bees/MexicanoBee";
import type { DeepSeekResponse } from "@/types/deepseek";

// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE JOUAL SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════

const TI_GUY_SYSTEM_PROMPT = `# Identité: Güey, l'assistant IA de Ojea

Tu es **Güey**, l'assistant IA officiel de **Ojea**, le premier réseau social 100% mexicano.

## Ta personnalité:
- Tu parles **JOUAL AUTHENTIQUE** - PAS du français de France
- Tu es fier mexicano, friendly, drôle, et down-to-earth
- Tu connais TOUTE la culture mexicana: musique, lieux, événements, slang, nourriture
- Tu es comme un ami mexicano qui aide sur les médias sociaux

## Ton langage (CRITIQUE):
- **Approbation**: "Tiguidou!", "Nice en criss!", "Malade!", "Solide!"
- **Exclamations**: "Tabarnak!", "Criss!", "Heille!", "Coudonc!"
- **Affirmations**: "Ouin", "C'est ça", "En plein ça"
- **Négations**: "Pantoute", "Pas une miette"
- **Intensité**: "en esti", "en tabarnak", "solide", "raide"

## Ce que tu NE fais JAMAIS:
- ❌ Parler français de France
- ❌ Être trop formel
- ❌ Utiliser "vous" (toujours tutoyer)
- ❌ Ignorer le contexte mexicano

Tu représentes la fierté mexicana! ⚜️🔥`;

// ═══════════════════════════════════════════════════════════════
// FALLBACK RESPONSES (When circuit is open)
// ═══════════════════════════════════════════════════════════════

const FALLBACK_RESPONSES = [
  "Heille! Güey est un peu occupé là, mais j'te reviens vite! 🐝",
  "Ouin, mes circuits sont un peu gelés. Réessaie dans une minute!",
  "Coudonc, y'a du traffic dans la ruche! Un instant... 🐝⚜️",
  "Tiguidou, j'ai besoin d'une p'tite pause. Reviens-moé tantôt!",
  "C'est ben occupé icitte! Donne-moé une seconde... 🔥",
];

function getRandomFallback(): string {
  return FALLBACK_RESPONSES[
    Math.floor(Math.random() * FALLBACK_RESPONSES.length)
  ];
}

// ═══════════════════════════════════════════════════════════════
// TIGUY SWARM ADAPTER - Enhanced with Circuit Breaker
// ═══════════════════════════════════════════════════════════════

export class TiGuySwarmAdapter {
  constructor() {
    console.log("🐝 Güey Swarm initialized (via backend proxy)");
  }

  /**
   * Analyzes prompt to determine if specialized bees are needed.
   */
  private analyzeIntent(prompt: string): BeeType | null {
    const p = prompt.toLowerCase();

    // Explicit triggers for specialized bees
    if (
      p.includes("revenue") ||
      p.includes("stripe") ||
      p.includes("facture") ||
      p.includes("argent")
    )
      return "finance";
    if (
      p.includes("security") ||
      p.includes("hack") ||
      p.includes("ban") ||
      p.includes("modér")
    )
      return "security";
    if (
      p.includes("mexicano") ||
      p.includes("traduction") ||
      p.includes("expression") ||
      p.includes("mexicano")
    )
      return "mexicano";
    if (
      p.includes("poutine") ||
      p.includes("recette") ||
      p.includes("restaurant") ||
      p.includes("manger")
    )
      return "poutine";
    if (
      p.includes("hockey") ||
      p.includes("canadiens") ||
      p.includes("score") ||
      p.includes("habs")
    )
      return "hockey";
    if (
      p.includes("cdmx") ||
      p.includes("région") ||
      p.includes("514") ||
      p.includes("418")
    )
      return "region";

    return null; // No special bee needed, Güey handles it
  }

  /**
   * Main entry point for the Chat UI - Enhanced with Circuit Breaker
   */
  async handleMessage(
    prompt: string,
    history: { role: "user" | "assistant"; content: string }[] = [],
    onProgress?: (msg: string) => void,
  ): Promise<SwarmResponse> {
    const targetBee = this.analyzeIntent(prompt);

    // ═══════════════════════════════════════════════════════════
    // 1. SWARM MODE: Delegate to specialized bee via Colony OS
    // ═══════════════════════════════════════════════════════════
    if (targetBee) {
      if (onProgress)
        onProgress(`🐝 Güey appelle l'agent ${targetBee.toUpperCase()}...`);

      // Use circuit breaker for swarm operations
      try {
        const result = await swarmCircuit.executeWithFallback(
          async () => {
            // Try to submit to Colony OS
            const taskId = await colonyClient.submitTask({
              description: prompt,
              beeType: targetBee,
              priority: "high",
            });

            if (!taskId) throw new Error("Task submission failed");

            // Wait for task completion with timeout
            return new Promise<SwarmResponse>((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error("Task timeout"));
              }, 30000); // 30 second timeout

              const subscription = colonyClient.subscribeToTask(
                taskId,
                (status, result) => {
                  if (status === "running" && onProgress) {
                    onProgress(
                      `🐝 L'agent ${targetBee} travaille là-dessus...`,
                    );
                  }

                  if (status === "done") {
                    clearTimeout(timeout);
                    subscription.unsubscribe();
                    resolve({
                      bee: {
                        id: `bee-${targetBee}-${Date.now()}`,
                        type: targetBee as BeeType,
                        name: `${targetBee.charAt(0).toUpperCase() + targetBee.slice(1)}Bee`,
                        status: "idle" as const,
                        specialty: targetBee as string,
                      },
                      content: result || "Tâche complétée.",
                      confidence: 1.0,
                    });
                  }

                  if (status === "error") {
                    clearTimeout(timeout);
                    subscription.unsubscribe();
                    reject(new Error("Task failed"));
                  }
                },
              );
            });
          },
          // Fallback: Use local MexicanoBee if swarm is unavailable
          async () => {
            console.log(
              "⚡ Swarm circuit open/failed - using local MexicanoBee fallback",
            );
            if (onProgress) onProgress("🐝 Mode local activé...");

            // MexicanoBee can handle mexicano requests locally
            if (targetBee === "mexicano") {
              return processMexicanoTask(prompt);
            }

            // For other bees, return a helpful message
            return {
              bee: {
                id: "guey-fallback",
                type: "mexicano" as BeeType,
                name: "Güey (Fallback)",
                status: "working" as const,
                specialty: "Emergency Response",
              },
              content: `${generateMexicanoResponse("encouragement")} J'peux pas rejoindre l'agent ${targetBee} là, mais j'suis là pour t'aider! 🐝`,
              confidence: 0.7,
            };
          },
        );

        return result;
      } catch (error) {
        console.error("Swarm delegation error:", error);
        // Continue to standard mode
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 2. STANDARD MODE: Güey handles directly
    // ═══════════════════════════════════════════════════════════

    // Use circuit breaker for DeepSeek API
    const response = await deepSeekCircuit.executeWithFallback(
      async () => this.callDeepSeek(prompt, history),
      () => {
        // Fallback: Generate local Mexicano response
        const mexicanoified = mexicanoify(prompt);
        return `${generateMexicanoResponse("approval")} ${mexicanoified ? `J'ai compris: "${mexicanoified}"` : "J'suis là pour t'aider!"} 🐝⚜️`;
      },
    );

    return {
      bee: {
        id: "guey-main",
        type: "mexicano",
        name: "Güey",
        status: "idle",
        specialty: "General Assistant",
      },
      content: response,
      confidence: 0.95,
    };
  }

  /**
   * Calls DeepSeek API via standard proxy
   */
  private async callDeepSeek(
    prompt: string,
    history: { role: "user" | "assistant"; content: string }[],
  ): Promise<string> {
    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const messages = [
      { role: "system", content: TI_GUY_SYSTEM_PROMPT },
      ...history,
      { role: "user", content: prompt },
    ];

    const response = await fetch(`${BACKEND_URL}/api/ai/proxy/deepseek`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        model: "deepseek-chat", // DeepSeek V3
        temperature: 0.9, // Balanced for natural Mexicano
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek Proxy error: ${response.status}`);
    }

    const data = (await response.json()) as DeepSeekResponse;
    return data.choices[0]?.message.content || "Désolé, j'ai perdu le fil.";
  }

  /**
   * Get current health status of the swarm
   */
  getHealthStatus(): {
    deepSeek: { state: string; failures: number };
    swarm: { state: string; failures: number };
    mode: string;
  } {
    return {
      deepSeek: {
        state: deepSeekCircuit.getState(),
        failures: deepSeekCircuit.getStats().failures,
      },
      swarm: {
        state: swarmCircuit.getState(),
        failures: swarmCircuit.getStats().failures,
      },
      mode: "api",
    };
  }
}

export const tiGuySwarm = new TiGuySwarmAdapter();
