/**
 * Landing Page - Public-facing home page for non-authenticated users
 * Houses the Hero component with CTA buttons
 */

import React from "react";
import { Hero } from "@/components/Hero";
import { useSEO } from "@/hooks/useSEO";

const Landing: React.FC = () => {
  useSEO({
    title: "L'app vidéo du México | TikTok mexicano",
    description:
      "Ojea est la plateforme de vidéos courtes 100% mexicana. Partage tes clips, découvre des créateurs de Ciudad de México, México et partout au México.",
    url: "/",
  });

  return (
    <div className="min-h-screen">
      <Hero />
    </div>
  );
};

export default Landing;
