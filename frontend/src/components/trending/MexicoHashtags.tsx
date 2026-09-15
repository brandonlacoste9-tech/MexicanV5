import React from "react";
import { TrendingUp, MapPin, Users } from "lucide-react";
import { region } from "@/config/region";
import { MEXICO_HASHTAGS } from "@/lib/mexicoFeatures";

interface TrendingTag {
  tag: string;
  count: number;
  trending: boolean;
  region?: string;
  category: "food" | "culture" | "sports" | "music" | "city";
}

export const MexicoHashtags: React.FC = () => {
  const trendingTags: TrendingTag[] = MEXICO_HASHTAGS.slice(0, 8).map(
    (tag, i) => ({
      tag,
      count: 1800 - i * 140,
      trending: i < 4,
      region: region.cities[i % region.cities.length],
      category: (["city", "food", "culture", "sports", "music"] as const)[i % 5],
    }),
  );

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-gold-400" />
            Hashtags en México
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Lo que está sonando ahora en el pack {region.brand}
          </p>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <MapPin className="w-4 h-4 mr-1" />
          <span>Al momento</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {trendingTags.map((item) => (
          <div
            key={item.tag}
            className={`p-4 rounded-xl border ${
              item.trending
                ? "border-gold-500/40 bg-gradient-to-br from-dark-800 to-gold-500/5"
                : "border-dark-700 bg-dark-800/50"
            } hover:border-gold-500/60 hover:shadow-lg hover:shadow-gold-500/10 transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-lg group-hover:text-gold-300 transition-colors">
                  {item.tag}
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-dark-700 text-gray-400">
                    {item.category}
                  </span>
                  {item.region && (
                    <span className="text-xs text-gray-500 ml-2 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.region}
                    </span>
                  )}
                </div>
              </div>
              {item.trending && (
                <div className="flex items-center text-xs text-gold-400 bg-gold-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Tendencia
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-700/50">
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                <span>{item.count.toLocaleString()} posts</span>
              </div>
              <button className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                Seguir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
