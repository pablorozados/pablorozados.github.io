
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  image_url?: string;
  date_is_approximate?: boolean;
}

interface MultipleTimestampsProps {
  events: TimelineEvent[];
  onEventsChange: (events: TimelineEvent[]) => void;
  onImageUpload: (eventId: string, file: File) => Promise<string | null>;
}

const MultipleTimestamps = ({ events, onEventsChange, onImageUpload }: MultipleTimestampsProps) => {
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});

  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      date: '',
      title: '',
      description: '',
      image_url: '',
      date_is_approximate: false
    };
    onEventsChange([...events, newEvent]);
  };

  const updateEvent = (id: string, field: keyof TimelineEvent, value: string | boolean) => {
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, [field]: value } : event
    );
    onEventsChange(updatedEvents);
  };

  const removeEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    onEventsChange(updatedEvents);
  };

  const handleImageUpload = async (eventId: string, file: File) => {
    setUploadingImages(prev => ({ ...prev, [eventId]: true }));
    
    try {
      const imageUrl = await onImageUpload(eventId, file);
      if (imageUrl) {
        updateEvent(eventId, 'image_url', imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImages(prev => ({ ...prev, [eventId]: false }));
    }
  };

  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="font-retro text-lg text-retro-blue">
          Eventos da Timeline
        </CardTitle>
        <p className="text-sm text-gray-400 font-mono">
          Adicione eventos históricos relacionados ao episódio
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="border border-retro-blue/30 rounded-lg p-4 bg-black/20">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-mono text-sm text-retro-yellow">
                  Evento #{index + 1}
                </h4>
                <Button
                  onClick={() => removeEvent(event.id)}
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`date-${event.id}`} className="font-mono text-gray-300 text-xs">
                    Data do Evento *
                  </Label>
                  <Input
                    id={`date-${event.id}`}
                    type="date"
                    value={event.date}
                    onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                    className="bg-black border-retro-blue text-white text-sm"
                    required
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id={`date-approximate-${event.id}`}
                      checked={event.date_is_approximate || false}
                      onCheckedChange={(checked) => 
                        updateEvent(event.id, 'date_is_approximate', !!checked)
                      }
                      className="border-retro-yellow data-[state=checked]:bg-retro-yellow data-[state=checked]:text-retro-black"
                    />
                    <Label htmlFor={`date-approximate-${event.id}`} className="font-mono text-xs text-gray-400">
                      Data imprecisa
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`title-${event.id}`} className="font-mono text-gray-300 text-xs">
                    Título do Evento *
                  </Label>
                  <Input
                    id={`title-${event.id}`}
                    value={event.title}
                    onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                    className="bg-black border-retro-blue text-white text-sm"
                    placeholder="Ex: Lançamento do Pac-Man"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor={`description-${event.id}`} className="font-mono text-gray-300 text-xs">
                  Descrição
                </Label>
                <Textarea
                  id={`description-${event.id}`}
                  value={event.description || ''}
                  onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                  className="bg-black border-retro-blue text-white text-sm"
                  placeholder="Descreva o evento histórico..."
                  rows={2}
                />
              </div>

              <div className="mt-4">
                <Label htmlFor={`image-${event.id}`} className="font-mono text-gray-300 text-xs">
                  Imagem do Evento
                </Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    id={`image-${event.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(event.id, file);
                      }
                    }}
                    className="bg-black border-retro-blue text-white text-sm flex-1"
                    disabled={uploadingImages[event.id]}
                  />
                  {uploadingImages[event.id] && (
                    <div className="text-retro-yellow text-sm font-mono">
                      <Upload size={16} className="animate-spin" />
                    </div>
                  )}
                </div>
                
                {event.image_url && (
                  <div className="mt-2">
                    <img 
                      src={event.image_url}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded border border-retro-blue"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          <Button
            onClick={addEvent}
            type="button"
            variant="outline"
            className="w-full border-retro-blue text-retro-blue hover:bg-retro-blue hover:text-black font-mono"
          >
            <Plus size={16} className="mr-2" />
            Adicionar Evento
          </Button>

          {events.length === 0 && (
            <div className="text-center py-8 text-gray-400 font-mono text-sm">
              Nenhum evento adicionado ainda
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultipleTimestamps;
