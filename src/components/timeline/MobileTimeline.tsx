
import React from 'react';
import { Episode } from '@/hooks/useEpisodes';

interface YearGroup {
  year: number;
  events: Array<{
    id: string;
    date: string;
    title: string;
    description?: string;
    image_url?: string;
    episode: Episode;
    isMainEpisode: boolean;
  }>;
}

interface MobileTimelineProps {
  yearGroups: YearGroup[];
  onEpisodeClick: (episode: Episode) => void;
  onYearClick: (yearGroup: YearGroup) => void;
}

const MobileTimeline = ({ yearGroups, onEpisodeClick, onYearClick }: MobileTimelineProps) => {
  return (
    <div className="lg:hidden space-y-4">
      {yearGroups.map((yearGroup) => (
        <div key={yearGroup.year} className="space-y-2">
          <div 
            className="flex items-center gap-4 p-4 retro-card rounded-lg cursor-pointer"
            onClick={() => onYearClick(yearGroup)}
          >
            <div className={`timeline-point w-12 h-12 rounded-full border-4 flex items-center justify-center relative ${
              yearGroup.events.some(e => e.isMainEpisode)
                ? 'bg-retro-yellow border-retro-blue' 
                : 'bg-retro-blue border-retro-yellow'
            }`}>
              <span className={`font-retro text-sm font-bold ${
                yearGroup.events.some(e => e.isMainEpisode) ? 'text-retro-black' : 'text-retro-yellow'
              }`}>
                {yearGroup.year.toString().slice(-2)}
              </span>
              {yearGroup.events.length > 1 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-retro-yellow text-retro-black rounded-full flex items-center justify-center text-xs font-bold">
                  {yearGroup.events.length}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-retro text-lg text-retro-yellow">
                {yearGroup.year}
              </h3>
              <p className="font-mono text-sm text-gray-400">
                {yearGroup.events.length} evento{yearGroup.events.length > 1 ? 's' : ''} - Toque para ver{yearGroup.events.length > 1 ? ' todos' : ''}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileTimeline;
