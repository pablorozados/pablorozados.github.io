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

interface TimelineTooltipProps {
  yearGroup: YearGroup;
  position: { x: number; y: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onImageClick: (imageUrl: string, title: string, e: React.MouseEvent) => void;
}

const TimelineTooltip = ({ 
  yearGroup, 
  position, 
  onMouseEnter, 
  onMouseLeave, 
  onImageClick 
}: TimelineTooltipProps) => {
  const separateEventsByType = (events: YearGroup['events']) => {
    const episodes = events.filter(e => e.isMainEpisode);
    const historicalEvents = events.filter(e => !e.isMainEpisode);
    return { episodes, historicalEvents };
  };

  const { episodes, historicalEvents } = separateEventsByType(yearGroup.events);

  return (
    <div 
      className="fixed pointer-events-none z-[50]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div 
        className="bg-black border-2 border-retro-yellow rounded-lg p-4 whitespace-normal w-80 shadow-2xl pointer-events-auto max-h-96 overflow-y-auto"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="font-retro text-lg text-retro-yellow mb-3">
          {yearGroup.year} ({yearGroup.events.length} evento{yearGroup.events.length > 1 ? 's' : ''})
        </div>
        
        <div className="space-y-4">
          {/* Episódios no Tooltip */}
          {episodes.length > 0 && (
            <div>
              <div className="font-mono text-sm text-retro-yellow mb-2 flex items-center gap-2">
                🎧 Episódios
              </div>
              <div className="space-y-3">
                {episodes.map((event) => (
                  <div key={`${event.episode.id}-${event.id}`} className="border-b border-retro-yellow/30 pb-2 last:border-b-0">
                    <div className={`font-mono text-xs mb-1 ${
                      event.episode?.date_is_approximate ? 'text-red-400' : 'text-retro-blue'
                    }`}>
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                      {event.episode?.date_is_approximate && (
                        <span className="ml-1 text-red-400">[data imprecisa]</span>
                      )}
                    </div>
                    <div className="font-mono text-sm text-retro-yellow font-bold mb-1 break-words">
                      {event.title}
                    </div>
                    {event.description && (
                      <div className="font-mono text-xs text-gray-300 mb-1 break-words">
                        {event.description}
                      </div>
                    )}
                    <div 
                      className="font-mono text-xs text-retro-blue cursor-pointer hover:text-retro-yellow transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Trigger episode modal
                        const episodeEvent = new CustomEvent('openEpisode', { detail: event.episode });
                        window.dispatchEvent(episodeEvent);
                      }}
                    >
                      ▶ Escutar episódio
                    </div>
                    {event.image_url && (
                      <div className="mt-2">
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-16 h-16 object-cover rounded border-2 border-retro-yellow cursor-pointer hover:scale-105 transition-transform"
                          onClick={(e) => onImageClick(event.image_url!, event.title, e)}
                          title="Clique para ampliar"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eventos Históricos no Tooltip */}
          {historicalEvents.length > 0 && (
            <div>
              <div className="font-mono text-sm text-gray-400 mb-2 flex items-center gap-2">
                📅 Eventos Históricos
              </div>
              <div className="space-y-2">
                {historicalEvents.map((event) => (
                  <div key={`${event.episode.id}-${event.id}`} className="border-b border-gray-600/30 pb-2 last:border-b-0">
                    <div className={`font-mono text-xs mb-1 ${
                      event.date_is_approximate ? 'text-red-400' : 'text-retro-blue'
                    }`}>
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                      {event.date_is_approximate && (
                        <span className="ml-1 text-red-400">[data imprecisa]</span>
                      )}
                    </div>
                    <div className="font-mono text-sm text-gray-300 mb-1 break-words">
                      {event.title}
                    </div>
                    {event.description && (
                      <div className="font-mono text-xs text-gray-400 mb-1 break-words">
                        {event.description}
                      </div>
                    )}
                    <div className="font-mono text-xs text-gray-500 break-words mb-1">
                      - {event.episode.title}
                    </div>
                    <div 
                      className="font-mono text-xs text-retro-blue cursor-pointer hover:text-retro-yellow transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Trigger episode modal
                        const episodeEvent = new CustomEvent('openEpisode', { detail: event.episode });
                        window.dispatchEvent(episodeEvent);
                      }}
                    >
                      ▶ Escutar episódio
                    </div>
                    {event.image_url && (
                      <div className="mt-2">
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-16 h-16 object-cover rounded border border-retro-blue cursor-pointer hover:scale-105 transition-transform"
                          onClick={(e) => onImageClick(event.image_url!, event.title, e)}
                          title="Clique para ampliar"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-700 font-mono text-xs text-gray-400">
          {yearGroup.events.length === 1 ? 'Clique no ponto para ver episódio' : 'Clique no ponto para ver todos os eventos'}
        </div>
      </div>
    </div>
  );
};

export default TimelineTooltip;
