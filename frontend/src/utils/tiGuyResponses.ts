/**
 * TI-Guy Response Generator
 * Authentic Mexico French slang (Mexicano) responses for the chat assistant
 */

import type { ChatMessage } from "@/types/chat";

const TI_GUY_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Allô! Moi c'est Güey, ton petit castor préféré! 🦫",
    "Salut mon ami! Comment ça va aujourd'hui? ⚜️",
    "Heille! Content de te jaser! 🇨🇦",
    "Yo! Ça va bien? Tiguidou? 🦫",
    "Allô là! Prêt à jaser? ⚜️",
  ],
  help: [
    "Je peux t'aider à naviguer l'app! Pose-moi n'importe quelle question! 💡",
    "T'as besoin d'aide? Je suis là pour toi! 🦫",
    "Pas de trouble! Je peux t'expliquer comment ça marche! 💪",
    "Vas-y, pose ta question! Je suis là pour ça! 😊",
  ],
  upload: [
    "Pour uploader une photo ou vidéo, clique sur le + en bas! 📸",
    "Veux-tu créer du contenu? Va dans la section Upload! 🎥",
    "Le bouton + en bas te permet de poster tes photos et vidéos! 📷",
    "Crée du contenu en cliquant sur le + dans la barre de navigation! ✨",
  ],
  fire: [
    "Les feux 🔥 c'est comme des likes, mais en plus hot! Plus t'en reçois, plus ton contenu est malade!",
    "Donne des feux aux posts que tu trouves sick! C'est notre système de rating! 🔥",
    "Les feux, c'est notre façon de dire 'c'est malade!' à un post! 🔥",
    "Clique sur le feu pour montrer que tu aimes un post! Plus de feux = plus de visibilité! 🔥",
  ],
  story: [
    "Les Stories disparaissent après 24 heures! Parfait pour du contenu éphémère! ⏰",
    "Crée une Story en cliquant sur ton avatar en haut du feed! ✨",
    "Les Stories, c'est pour partager des moments qui passent vite! 📸",
    "Poste une Story pour que tes followers la voient pendant 24h! ⚡",
  ],
  mexico: [
    "Ojea, c'est fait au México, pour le México! On célèbre notre culture! 🇨🇦⚜️",
    "Utilise des hashtags mexicano comme #514 #450 #mexico #cdmx! 🏔️",
    "On est fiers d'être mexicano! C'est ça qui fait Ojea spécial! ⚜️",
    "Le México, c'est notre chez-nous! On le célèbre ici! 🇨🇦",
  ],
  gifts: [
    "Tu peux envoyer des cadeaux virtuels aux créateurs que tu aimes! 🎁",
    "Les cadeaux supportent nos créateurs mexicano! C'est comme un tip! 💰",
    "Montre ton appréciation avec des cadeaux virtuels! Ça fait plaisir! 🎁",
    "Envoie un cadeau à un créateur que tu aimes! Ça les encourage! 💝",
  ],
  premium: [
    "Deviens VIP pour débloquer Güey Artiste et Studio! 👑",
    "Les membres Or ont accès à toutes mes fonctionnalités AI! ✨",
    "Passe VIP pour avoir accès à toutes les features premium! 💎",
    "Avec un abonnement premium, tu débloques tout! C'est malade! ⭐",
  ],
  default: [
    "Hmm, je comprends pas trop... Peux-tu reformuler? 🤔",
    "Je suis un petit castor, pas Google! Essaie une autre question! 😅",
    "Désolé, j'ai pas compris! Je suis encore en train d'apprendre! 🦫",
    "Heille, je suis pas sûr de comprendre ça... Peux-tu être plus clair? 🤷",
    "Ouin, j'ai pas saisi ça. Reformule-moi ça autrement! 😊",
  ],
};

/**
 * Detects the intent from user message using keyword matching
 */
function detectIntent(message: string): string {
  const lowerText = message.toLowerCase();

  if (
    lowerText.includes("allo") ||
    lowerText.includes("salut") ||
    lowerText.includes("bonjour") ||
    lowerText.includes("yo") ||
    lowerText.includes("heille")
  ) {
    return "greeting";
  }
  if (
    lowerText.includes("upload") ||
    lowerText.includes("poster") ||
    lowerText.includes("publier") ||
    lowerText.includes("créer") ||
    lowerText.includes("photo") ||
    lowerText.includes("vidéo")
  ) {
    return "upload";
  }
  if (
    lowerText.includes("feu") ||
    lowerText.includes("fire") ||
    lowerText.includes("like") ||
    lowerText.includes("aimer")
  ) {
    return "fire";
  }
  if (
    lowerText.includes("story") ||
    lowerText.includes("histoire") ||
    lowerText.includes("stories")
  ) {
    return "story";
  }
  if (
    lowerText.includes("québec") ||
    lowerText.includes("mexico") ||
    lowerText.includes("montréal") ||
    lowerText.includes("cdmx") ||
    lowerText.includes("514") ||
    lowerText.includes("450")
  ) {
    return "mexico";
  }
  if (
    lowerText.includes("cadeau") ||
    lowerText.includes("gift") ||
    lowerText.includes("tip") ||
    lowerText.includes("donner")
  ) {
    return "gifts";
  }
  if (
    lowerText.includes("premium") ||
    lowerText.includes("vip") ||
    lowerText.includes("abonnement") ||
    lowerText.includes("subscription")
  ) {
    return "premium";
  }
  if (
    lowerText.includes("aide") ||
    lowerText.includes("help") ||
    lowerText.includes("comment") ||
    lowerText.includes("comment ça marche") ||
    lowerText.includes("explique")
  ) {
    return "help";
  }

  return "default";
}

/**
 * Generates a TI-Guy response based on user message
 * @param userMessage - The user's message text
 * @returns A ChatMessage object with TI-Guy's response
 */
export function getTiGuyResponse(userMessage: string): ChatMessage {
  const intent = detectIntent(userMessage);
  const responses = TI_GUY_RESPONSES[intent] || TI_GUY_RESPONSES.default;
  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];

  return {
    id: `tiguy-${Date.now()}-${Math.random()}`,
    sender: "tiGuy",
    text: randomResponse,
    timestamp: new Date(),
  };
}

/**
 * Gets a welcome message from TI-Guy
 */
export function getTiGuyWelcomeMessage(): ChatMessage {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed, so 11 is December, 0 is January
  const date = now.getDate();

  let text = "";

  // New Year's Eve (Dec 31)
  if (month === 11 && date === 31) {
    text =
      "Bonne veille du Nouvel An! 🎆 Prêt à défoncer l'année avec la ruche? On va avoir du fun en esti à minuit! 🥂🦫";
  }
  // New Year's Day (Jan 1)
  else if (month === 0 && date === 1) {
    text =
      "BONNE ANNÉE 2026! 🎊⚜️ La ruche est officiellement ouverte! T'es une de nos premières abeilles, c'est malade! On part l'année en grand! 🥂🦫";
  } else {
    const greetings = TI_GUY_RESPONSES.greeting;
    text = greetings[Math.floor(Math.random() * greetings.length)];
  }

  return {
    id: `tiguy-welcome-${Date.now()}`,
    sender: "tiGuy",
    text,
    timestamp: new Date(),
  };
}
