import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  image_url?: string;
  date_is_approximate?: boolean;
}

export interface Episode {
  id: string;
  title: string;
  description: string | null;
  listen_url: string | null;
  cover_image_url: string | null;
  historical_date: string;
  year: number;
  timeline_events: TimelineEvent[];
  created_at: string;
  updated_at: string;
  date_is_approximate: boolean;
}

export const useEpisodes = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEpisodes = async () => {
    try {
      console.log('Fetching episodes...');
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .order('year', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Raw episodes data:', data);
      
      // Parse timeline_events JSON field
      const episodesWithEvents = (data || []).map(episode => {
        let timelineEvents: TimelineEvent[] = [];
        
        try {
          if (episode.timeline_events) {
            if (typeof episode.timeline_events === 'string') {
              timelineEvents = JSON.parse(episode.timeline_events);
            } else if (Array.isArray(episode.timeline_events)) {
              timelineEvents = episode.timeline_events;
            }
          }
        } catch (parseError) {
          console.error('Error parsing timeline_events for episode:', episode.id, parseError);
          timelineEvents = [];
        }
        
        return {
          ...episode,
          timeline_events: timelineEvents,
          date_is_approximate: Boolean(episode.date_is_approximate)
        };
      });
      
      console.log('Processed episodes:', episodesWithEvents);
      setEpisodes(episodesWithEvents);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar episódios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEpisode = async (episodeData: Omit<Episode, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const dataToInsert = {
        ...episodeData,
        timeline_events: JSON.stringify(episodeData.timeline_events || [])
      };

      const { data, error } = await supabase
        .from('episodes')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;

      const newEpisode = {
        ...data,
        timeline_events: data.timeline_events ? JSON.parse(data.timeline_events) : []
      };

      setEpisodes(prev => [...prev, newEpisode].sort((a, b) => a.year - b.year));
      toast({
        title: "Sucesso",
        description: "Episódio adicionado com sucesso!",
      });
      return { data: newEpisode, error: null };
    } catch (error) {
      console.error('Error adding episode:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar episódio",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEpisode = async (id: string, episodeData: Partial<Omit<Episode, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const dataToUpdate = {
        ...episodeData,
        timeline_events: episodeData.timeline_events ? JSON.stringify(episodeData.timeline_events) : undefined,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('episodes')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedEpisode = {
        ...data,
        timeline_events: data.timeline_events ? JSON.parse(data.timeline_events) : []
      };

      setEpisodes(prev => prev.map(ep => ep.id === id ? updatedEpisode : ep).sort((a, b) => a.year - b.year));
      toast({
        title: "Sucesso",
        description: "Episódio atualizado com sucesso!",
      });
      return { data: updatedEpisode, error: null };
    } catch (error) {
      console.error('Error updating episode:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar episódio",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteEpisode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('episodes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEpisodes(prev => prev.filter(ep => ep.id !== id));
      toast({
        title: "Sucesso",
        description: "Episódio excluído com sucesso!",
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting episode:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir episódio",
        variant: "destructive",
      });
      return { error };
    }
  };

  const uploadImage = async (file: File, folder: string = 'covers'): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('episode-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('episode-covers')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, []);

  return {
    episodes,
    loading,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    uploadImage,
    refetch: fetchEpisodes,
  };
};
