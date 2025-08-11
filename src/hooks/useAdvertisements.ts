import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Advertisement {
  id: string;
  image_url: string;
  description: string;
  system: string;
  enviada_por?: string;
  created_at: string;
  updated_at: string;
}

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdvertisements(data || []);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar propagandas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAdvertisement = async (advertisementData: Omit<Advertisement, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .insert([advertisementData])
        .select()
        .single();

      if (error) throw error;

      setAdvertisements(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Propaganda adicionada com sucesso!",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error adding advertisement:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar propaganda",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateAdvertisement = async (id: string, advertisementData: Partial<Advertisement>) => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .update(advertisementData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAdvertisements(prev => 
        prev.map(ad => ad.id === id ? data : ad)
      );
      toast({
        title: "Sucesso",
        description: "Propaganda atualizada com sucesso!",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error updating advertisement:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar propaganda",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteAdvertisement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAdvertisements(prev => prev.filter(ad => ad.id !== id));
      toast({
        title: "Sucesso",
        description: "Propaganda excluída com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir propaganda",
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (file: File, folder: string = 'advertisements'): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
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
    fetchAdvertisements();
  }, []);

  return {
    advertisements,
    loading,
    addAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    uploadImage,
  };
};