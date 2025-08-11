
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

interface TimelineEventSelectorProps {
  selectedYear: YearGroup;
  onEpisodeClick: (episode: Episode) => void;
  onClose: () => void;
  onImageClick?: (imageUrl: string, title: string) => void;
}

const TimelineEventSelector = ({ selectedYear, onEpisodeClick, onClose, onImageClick }: TimelineEventSelectorProps) => {
  const separateEventsByType = (events: YearGroup['events']) => {
    const episodes = events.filter(e => e.isMainEpisode);
    const historicalEvents = events.filter(e => !e.isMainEpisode);
    return { episodes, historicalEvents };
  };

  const { episodes, historicalEvents } = separateEventsByType(selectedYear.events);

  return (
    <div className="mt-20 bg-retro-black border-2 border-retro-yellow rounded-lg p-6">
      <h3 className="font-retro text-2xl text-retro-yellow mb-4">
        Eventos de {selectedYear.year}
      </h3>
      
      <div className="space-y-6">
        {/* Seção de Episódios */}
        {episodes.length > 0 && (
          <div>
            <h4 className="font-mono text-lg text-retro-yellow mb-3 flex items-center gap-2">
              🎧 Episódios ({episodes.length})
            </h4>
            <div className="grid gap-3">
              {episodes.map((event) => (
                <div
                  key={`${event.episode.id}-${event.id}`}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-retro-yellow/10 to-retro-blue/10 border border-retro-yellow/30 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-retro-yellow/20 hover:to-retro-blue/20 transition-all"
                  onClick={() => onEpisodeClick(event.episode)}
                >
                  <img
                    src={event.image_url || event.episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                    alt={event.title}
                    className="w-14 h-14 object-cover rounded border-2 border-retro-yellow"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-mono text-lg text-retro-yellow font-bold truncate">
                      {event.title}
                    </h5>
                    <p className="font-mono text-base text-gray-300">
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </p>
                     {event.description && (
                       <p className="font-mono text-sm text-gray-400 mt-1">
                         {event.description}
                       </p>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção de Eventos Históricos */}
        {historicalEvents.length > 0 && (
          <div>
            <h4 className="font-mono text-lg text-gray-400 mb-3 flex items-center gap-2">
              📅 Eventos Históricos ({historicalEvents.length})
            </h4>
            <div className="grid gap-2">
              {historicalEvents.map((event) => (
                <div
                  key={`${event.episode.id}-${event.id}`}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-600/30"
                >
                  <img
                    src={event.image_url || event.episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                    alt={event.title}
                    className="w-10 h-10 object-cover rounded border border-retro-blue cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onImageClick) {
                        onImageClick(event.image_url || event.episode.cover_image_url || '', event.title);
                      }
                    }}
                  />
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onEpisodeClick(event.episode)}
                  >
                    <h5 className="font-mono text-lg text-gray-300 truncate">
                      {event.title}
                    </h5>
                    <p className="font-mono text-base text-gray-500">
                      {new Date(event.date).toLocaleDateString('pt-BR')} | {event.episode.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={onClose}
        className="mt-4 font-mono text-sm text-gray-400 hover:text-retro-yellow"
      >
        Fechar
      </button>
    </div>
  );
};

export default TimelineEventSelector;
