
import React from 'react';

interface YearGroup {
  year: number;
  events: Array<{
    id: string;
    date: string;
    title: string;
    description?: string;
    image_url?: string;
    episode: any;
    isMainEpisode: boolean;
    date_is_approximate?: boolean;
  }>;
}

interface TimelinePointProps {
  yearGroup: YearGroup;
  index: number;
  totalGroups: number;
  onYearClick: (yearGroup: YearGroup) => void;
  onMouseEnter: (yearGroup: YearGroup, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

const TimelinePoint = ({ 
  yearGroup, 
  index, 
  totalGroups, 
  onYearClick, 
  onMouseEnter, 
  onMouseLeave 
}: TimelinePointProps) => {
  
  // Espaçamento entre pontos controlado pelo flexbox do container

  return (
    <div
      className="flex flex-col items-center mx-2 min-w-[64px]"
    >
      {/* Área de hover expandida */}
      <div 
        className="cursor-pointer relative w-16 h-16 flex items-center justify-center"
        onClick={() => onYearClick(yearGroup)}
        onMouseEnter={(e) => onMouseEnter(yearGroup, e)}
        onMouseLeave={onMouseLeave}
      >
        {/* Timeline Point */}
        <div className={`timeline-point w-8 h-8 rounded-full border-4 relative ${
          yearGroup.events.some(e => e.isMainEpisode)
            ? 'bg-retro-yellow border-retro-blue'
            : 'bg-retro-blue border-retro-yellow'
        }`}>
          {yearGroup.events.length > 1 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-retro-yellow text-retro-black rounded-full flex items-center justify-center text-xs font-bold">
              {yearGroup.events.length}
            </div>
          )}
        </div>
      </div>
      
      {/* Year Label */}
      <div className="text-center mt-2 pointer-events-none">
        <div className={`font-retro text-lg font-bold ${
          yearGroup.events.some(e => e.isMainEpisode) 
            ? 'text-retro-yellow'
            : 'text-retro-blue'
        }`}>
          {yearGroup.year}
        </div>
      </div>
    </div>
  );
};

export default TimelinePoint;
