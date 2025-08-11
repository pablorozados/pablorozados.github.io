import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, LogOut, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEpisodes, Episode } from '@/hooks/useEpisodes';
import { useToast } from '@/hooks/use-toast';
import MultipleTimestamps, { TimelineEvent } from '@/components/MultipleTimestamps';

const Admin = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { episodes, loading: episodesLoading, addEpisode, updateEpisode, deleteEpisode, uploadImage } = useEpisodes();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listen_url: '',
    historical_date: '',
    date_is_approximate: false,
  });
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  console.log('Auth loading:', authLoading, 'User:', user);
  console.log('Episodes loading:', episodesLoading, 'Episodes count:', episodes.length);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-retro-black flex items-center justify-center">
        <div className="text-retro-yellow font-mono">Carregando autenticação...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      listen_url: '',
      historical_date: '',
      date_is_approximate: false,
    });
    setTimelineEvents([]);
    setCoverFile(null);
    setEditingEpisode(null);
    
    // Reset file input
    const fileInput = document.getElementById('cover-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleEdit = (episode: Episode) => {
    setEditingEpisode(episode);
    setFormData({
      title: episode.title,
      description: episode.description || '',
      listen_url: episode.listen_url || '',
      historical_date: episode.historical_date,
      date_is_approximate: episode.date_is_approximate || false,
    });
    setTimelineEvents(episode.timeline_events || []);
  };

  const handleDelete = async (episodeId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este episódio?')) {
      await deleteEpisode(episodeId);
    }
  };

  const handleTimelineImageUpload = async (eventId: string, file: File): Promise<string | null> => {
    return await uploadImage(file, 'timeline-events');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let coverImageUrl = editingEpisode?.cover_image_url || null;
      
      if (coverFile) {
        const uploadedUrl = await uploadImage(coverFile);
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
        coverImageUrl = uploadedUrl;
      }

      // Derivar o ano da data específica
      const year = new Date(formData.historical_date).getFullYear();

      const episodeData = {
        title: formData.title,
        description: formData.description,
        listen_url: formData.listen_url,
        cover_image_url: coverImageUrl,
        historical_date: formData.historical_date,
        year: year,
        timeline_events: timelineEvents,
        date_is_approximate: formData.date_is_approximate,
      };

      let error;
      if (editingEpisode) {
        const result = await updateEpisode(editingEpisode.id, episodeData);
        error = result.error;
      } else {
        const result = await addEpisode(episodeData);
        error = result.error;
      }
      
      if (!error) {
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting episode:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-retro-black p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-retro-yellow text-retro-yellow"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar ao Site
            </Button>
            <h1 className="font-retro text-3xl text-retro-yellow">
              PAINEL ADMINISTRATIVO
            </h1>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </div>

        {episodesLoading ? (
          <div className="text-center py-16">
            <div className="text-retro-yellow font-mono">Carregando episódios...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add/Edit Episode Form */}
            <Card className="retro-card">
              <CardHeader>
                <CardTitle className="font-retro text-xl text-retro-blue flex items-center gap-2">
                  {editingEpisode ? <Edit size={20} /> : <Plus size={20} />}
                  {editingEpisode ? 'Editar Episódio' : 'Adicionar Episódio'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="font-mono text-gray-300">
                      Nome do Episódio *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-black border-retro-blue text-white"
                      placeholder="Ex: A Era do Atari 2600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="historical_date" className="font-mono text-gray-300">
                      Data do Episódio *
                    </Label>
                    <Input
                      id="historical_date"
                      type="date"
                      value={formData.historical_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, historical_date: e.target.value }))}
                      className="bg-black border-retro-blue text-white"
                      required
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="date_is_approximate"
                        checked={formData.date_is_approximate}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, date_is_approximate: !!checked }))
                        }
                        className="border-retro-yellow data-[state=checked]:bg-retro-yellow data-[state=checked]:text-retro-black"
                      />
                      <Label htmlFor="date_is_approximate" className="font-mono text-xs text-gray-400">
                        Data imprecisa (quando não souber o dia exato)
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Esta data será usada para posicionar o episódio principal na timeline
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="font-mono text-gray-300">
                      Descrição *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-black border-retro-blue text-white"
                      placeholder="Descreva o episódio..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="listen_url" className="font-mono text-gray-300">
                      Link para Escutar
                    </Label>
                    <Input
                      id="listen_url"
                      type="url"
                      value={formData.listen_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, listen_url: e.target.value }))}
                      className="bg-black border-retro-blue text-white"
                      placeholder="https://spotify.com/..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="cover-upload" className="font-mono text-gray-300">
                      Imagem de Capa
                    </Label>
                    <Input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      className="bg-black border-retro-blue text-white"
                    />
                    {coverFile && (
                      <div className="mt-2">
                        <p className="text-sm text-retro-yellow mb-2">
                          Arquivo selecionado: {coverFile.name}
                        </p>
                        <img 
                          src={URL.createObjectURL(coverFile)}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded border border-retro-blue"
                        />
                      </div>
                    )}
                    {editingEpisode && !coverFile && editingEpisode.cover_image_url && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400 mb-2">
                          Imagem atual será mantida se nenhuma nova for selecionada
                        </p>
                        <img 
                          src={editingEpisode.cover_image_url}
                          alt="Capa atual"
                          className="w-20 h-20 object-cover rounded border border-retro-blue"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <MultipleTimestamps
                      events={timelineEvents}
                      onEventsChange={setTimelineEvents}
                      onImageUpload={handleTimelineImageUpload}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="retro-button flex-1 font-mono font-bold"
                    >
                      {editingEpisode ? <Edit size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                      {isSubmitting ? 'Salvando...' : editingEpisode ? 'Atualizar Episódio' : 'Adicionar Episódio'}
                    </Button>
                    {editingEpisode && (
                      <Button
                        type="button"
                        onClick={resetForm}
                        variant="outline"
                        className="border-gray-500 text-gray-400"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Episodes List */}
            <Card className="retro-card">
              <CardHeader>
                <CardTitle className="font-retro text-xl text-retro-yellow">
                  Episódios ({episodes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="bg-black/50 border border-retro-blue rounded p-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-mono text-sm text-retro-yellow truncate">
                            {episode.title}
                          </h3>
                          <p className="text-xs text-gray-400">
                            Data: {new Date(episode.historical_date).toLocaleDateString('pt-BR')} | Ano: {episode.year}
                            {episode.date_is_approximate && (
                              <span className="text-red-400 ml-1">[data imprecisa]</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-300 line-clamp-2 mt-1">
                            {episode.description}
                          </p>
                          {episode.timeline_events && episode.timeline_events.length > 0 && (
                            <p className="text-xs text-retro-blue mt-1">
                              {episode.timeline_events.length} evento(s) na timeline
                            </p>
                          )}
                          {episode.listen_url && (
                            <a 
                              href={episode.listen_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-retro-blue hover:text-retro-yellow"
                            >
                              Link para escutar
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {episode.cover_image_url && (
                            <img 
                              src={episode.cover_image_url} 
                              alt={episode.title}
                              className="w-16 h-16 object-cover rounded border border-retro-blue"
                            />
                          )}
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleEdit(episode)}
                              size="sm"
                              variant="outline"
                              className="border-retro-blue text-retro-blue hover:bg-retro-blue hover:text-black p-1"
                            >
                              <Edit size={12} />
                            </Button>
                            <Button
                              onClick={() => handleDelete(episode.id)}
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white p-1"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {episodes.length === 0 && (
                    <p className="text-gray-400 text-center py-8 font-mono">
                      Nenhum episódio cadastrado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
