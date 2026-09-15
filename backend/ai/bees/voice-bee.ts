/**
 * 🎤 Voice Bee (Version Souveraine - Google Cloud)
 * Text-to-Speech et Speech-to-Text pour Güey
 * Branchement sur Google Cloud pour un accent mexicano authentique.
 *
 * 🌟 VOIX CÉLÈBRES DU MÉXICO:
 * - "celine" → Céline Dion (style diva)
 * - "ginette" → Ginette Reno (style maman Mexicana)
 * - "denis" → Denis Lévesque (style animateur TVA)
 * - "jean" → Jean Lapointe (style humoriste)
 * - "guey" → Notre castor national 🦫
 */

import { z } from "zod";
import { SpeechClient } from "@google-cloud/speech";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

// Schéma de génération vocale avec voix célèbres
export const VoiceGenerationSchema = z.object({
  text: z.string().min(1).max(5000),
  voice: z
    .enum([
      "guey",
      "celine", // Céline Dion style
      "ginette", // Ginette Reno style
      "denis", // Denis Lévesque style
      "jean", // Jean Lapointe style
      "julie", // Julie Snyder style
      "mike", // Mike Ward style
      "mario", // Mario Dumont style
    ])
    .default("guey"),
  speed: z.number().optional().default(1.0),
  emotion: z.string().optional().default("happy"),
});

export type VoiceGenerationRequest = z.infer<typeof VoiceGenerationSchema>;

// 🌟 Configuration des voix célèbres
const CELEBRITY_VOICES: Record<
  string,
  {
    name: string;
    gender: string;
    pitch: number;
    speakingRate: number;
    effects?: string;
  }
> = {
  "guey": {
    name: "es-MX-Standard-D",
    gender: "MALE",
    pitch: 0,
    speakingRate: 1.0,
  },
  celine: {
    name: "es-MX-Standard-A", // Voix féminine
    gender: "FEMALE",
    pitch: 2.5, // Plus aigu comme Céline
    speakingRate: 0.9, // Un peu plus lent (dramatique)
    effects: "Céline Dion style: 'Mon dieu, c'est fantastique!'",
  },
  ginette: {
    name: "es-MX-Standard-C",
    gender: "FEMALE",
    pitch: -1.5, // Plus grave (maman)
    speakingRate: 1.1,
    effects: "Ginette Reno style: chaleureuse et maternelle",
  },
  denis: {
    name: "es-MX-Standard-D",
    gender: "MALE",
    pitch: -2, // Grave comme animateur
    speakingRate: 1.2, // Rapide comme au journal
    effects: "Denis Lévesque style: journaliste dynamique",
  },
  jean: {
    name: "es-MX-Standard-B",
    gender: "MALE",
    pitch: -1,
    speakingRate: 0.95,
    effects: "Jean Lapointe style: humoriste charismatique",
  },
  julie: {
    name: "es-MX-Standard-A",
    gender: "FEMALE",
    pitch: 1.5,
    speakingRate: 1.3, // Très rapide
    effects: "Julie Snyder style: énergique et rapide",
  },
  mike: {
    name: "es-MX-Standard-D",
    gender: "MALE",
    pitch: -0.5,
    speakingRate: 1.1,
    effects: "Mike Ward style: comédien sarcastique",
  },
  mario: {
    name: "es-MX-Standard-B",
    gender: "MALE",
    pitch: 0.5,
    speakingRate: 0.9, // Lent et posé
    effects: "Mario Dumont style: politique calme",
  },
};

export class VoiceBee {
  private clientSTT: SpeechClient;
  private clientTTS: TextToSpeechClient;

  constructor() {
    this.clientSTT = new SpeechClient();
    this.clientTTS = new TextToSpeechClient();
  }

  /**
   * 🎭 Get available celebrity voices
   */
  getCelebrityVoices(): Array<{
    id: string;
    name: string;
    description: string;
    emoji: string;
  }> {
    return [
      {
        id: "guey",
        name: "TI-GUY",
        description: "Le castor mexicano",
        emoji: "🦫",
      },
      {
        id: "celine",
        name: "Céline",
        description: "Style diva internationale",
        emoji: "🎤",
      },
      {
        id: "ginette",
        name: "Ginette",
        description: "La maman du México",
        emoji: "❤️",
      },
      {
        id: "denis",
        name: "Denis",
        description: "Animateur TVA dynamique",
        emoji: "📺",
      },
      {
        id: "jean",
        name: "Jean",
        description: "Humoriste charismatique",
        emoji: "😄",
      },
      {
        id: "julie",
        name: "Julie",
        description: "Énergie débordante",
        emoji: "⚡",
      },
      {
        id: "mike",
        name: "Mike",
        description: "Comédien sarcastique",
        emoji: "🎭",
      },
      {
        id: "mario",
        name: "Mario",
        description: "Voix posée politique",
        emoji: "🏛️",
      },
    ];
  }

  getPronunciationGuide(): Record<string, string> {
    return {
      zyeuté: "zi-yeu-té",
      poutine: "pou-tsine",
      québec: "ké-bek",
      "guey": "tsi-ghi",
      chum: "tchum",
      char: "tchar",
      frette: "frette",
    };
  }

  /**
   * 🗣️ TEXT-TO-SPEECH (Génération de la voix de Güey ou Célébrités)
   */
  async textToSpeech(request: VoiceGenerationRequest): Promise<{
    success: boolean;
    audioBase64?: string;
    voiceUsed?: string;
    error?: string;
  }> {
    try {
      const voiceConfig =
        CELEBRITY_VOICES[request.voice] || CELEBRITY_VOICES["guey"];

      console.log(
        `🎙️ Synthèse vocale [${request.voice}] pour : "${request.text.substring(0, 50)}..."`,
      );

      // Ajouter une signature vocale selon la célébrité
      let textToSpeak = request.text;
      if (request.voice === "celine" && !textToSpeak.includes("mon dieu")) {
        textToSpeak = textToSpeak + "! Mon dieu!";
      } else if (request.voice === "ginette") {
        textToSpeak = "Mon chum, " + textToSpeak;
      } else if (request.voice === "denis") {
        textToSpeak = "Alors là! " + textToSpeak;
      }

      const [response] = await this.clientTTS.synthesizeSpeech({
        input: { text: textToSpeak },
        voice: {
          languageCode: "es-MX",
          name: voiceConfig.name,
          ssmlGender: voiceConfig.gender as any,
        },
        audioConfig: {
          audioEncoding: "MP3",
          pitch: voiceConfig.pitch,
          speakingRate: voiceConfig.speakingRate * request.speed,
        },
      });

      if (!response.audioContent) {
        throw new Error("Contenu audio vide reçu de Google TTS.");
      }

      const base64 = Buffer.from(response.audioContent as Uint8Array).toString(
        "base64",
      );

      return {
        success: true,
        audioBase64: base64,
        voiceUsed: request.voice,
      };
    } catch (erreur) {
      console.error("❌ Échec TTS Google Cloud :", erreur);
      return {
        success: false,
        error: erreur instanceof Error ? erreur.message : "Erreur TTS inconnue",
      };
    }
  }

  /**
   * 🎧 SPEECH-TO-TEXT (Les oreilles de Güey)
   */
  async speechToText(audioBase64: string): Promise<{
    success: boolean;
    text?: string;
    error?: string;
  }> {
    try {
      console.log("👂 Transcription audio en cours (es-MX)...");

      const request = {
        audio: { content: audioBase64 },
        config: {
          encoding: "WEBM_OPUS" as any, // Format standard des blobs média navigateur
          sampleRateHertz: 48000,
          languageCode: "es-MX", // On écoute le Mexicano !
        },
      };

      const [response] = await this.clientSTT.recognize(request as any);
      const transcription = response.results
        ?.map((result) => result.alternatives?.[0].transcript)
        .join("\n");

      if (!transcription) {
        return { success: false, error: "J'ai rien entendu, mon chum!" };
      }

      return {
        success: true,
        text: transcription,
      };
    } catch (erreur) {
      console.error("❌ Échec STT Google Cloud :", erreur);
      return {
        success: false,
        error: erreur instanceof Error ? erreur.message : "Erreur STT inconnue",
      };
    }
  }
}

export const voiceBee = new VoiceBee();
