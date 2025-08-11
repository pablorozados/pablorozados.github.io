import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Episode } from '@/hooks/useEpisodes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface SwipeableMobileTimelineProps {
  yearGroups: YearGroup[];
  onEpisodeClick: (episode: Episode) => void;
  onYearClick: (yearGroup: YearGroup) => void;
}

const SwipeableMobileTimeline = ({ yearGroups, onEpisodeClick, onYearClick }: SwipeableMobileTimelineProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(yearGroups.length / itemsPerPage);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrev,
    trackMouse: true,
    trackTouch: true,
  });

  const currentYearGroups = yearGroups.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div className="lg:hidden">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPrev}
          disabled={totalPages <= 1}
          className="p-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <span className="font-mono text-sm text-gray-400">
            {currentIndex + 1} de {totalPages}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNext}
          disabled={totalPages <= 1}
          className="p-2"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Swipeable Timeline */}
      <div {...handlers} className="space-y-4 touch-pan-y">
        {currentYearGroups.map((yearGroup) => (
          <div key={yearGroup.year} className="space-y-2">
            <div 
              className="flex items-center gap-4 p-4 retro-card rounded-lg cursor-pointer transform transition-transform active:scale-95"
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

      {/* Page Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-retro-yellow' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Swipe Hint */}
      <div className="text-center mt-4">
        <p className="font-mono text-xs text-gray-500">
          Deslize para navegar entre os anos
        </p>
      </div>
    </div>
  );
};

export default SwipeableMobileTimeline;