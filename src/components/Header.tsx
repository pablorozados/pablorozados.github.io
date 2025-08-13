// Header.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Settings, Heart, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEpisodes } from '@/hooks/useEpisodes';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onAdminClick?: () => void; // Tornar opcional
}

const Header = ({ onAdminClick }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { episodes } = useEpisodes();
  const { user } = useAuth(); // Importar para verificar se está logado

  const latestEpisode = episodes.length > 0
    ? episodes.reduce((latest, current) => current.year > latest.year ? current : latest)
    : null;

  const handleTimelineClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const elem = document.getElementById('timeline');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const elem = document.getElementById('timeline');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Função inteligente para navegação do admin
  const handleAdminClick = () => {
    // Se há uma função customizada (como na página Propagandas), usar ela
    if (onAdminClick) {
      onAdminClick();
      return;
    }

    // Para a página de Propagandas, usar função global se existir
    if (location.pathname === '/propagandas' && (window as any).propagandasAdminClick) {
      (window as any).propagandasAdminClick();
      return;
    }

    // Para todas as outras páginas, vai para o admin principal
    window.location.href = '/#/admin/login';
  };

  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-retro font-bold text-xl text-retro-yellow hover:text-retro-yellow/80 transition-colors">
            A DITA HISTÓRIA DO VIDEOGAME
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href={latestEpisode?.listen_url || "https://pod.link/1513923155"} 
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-gray-400 hover:text-retro-yellow transition-colors"
          >
            🎧 Escute o último episódio
          </a>

          {/* Apoie */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-retro-yellow transition-colors font-mono text-xs flex items-center gap-2">
                <Heart size={16} />
                Apoie o podcast
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-retro-yellow max-w-md">
              <DialogHeader>
                <DialogTitle className="font-retro text-retro-yellow text-center">
                  Ajude a manter o podcast
                </DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <button onClick={handleTimelineClick} className="font-mono text-gray-300 hover:text-retro-yellow transition-colors">
            Timeline
          </button>
          <Link to="/propagandas" className={`font-mono transition-colors ${location.pathname === '/propagandas' ? 'text-retro-yellow' : 'text-gray-300 hover:text-retro-yellow'}`}>
            Propagandas
          </Link>
          <Link to="/sobre" className={`font-mono transition-colors ${location.pathname === '/sobre' ? 'text-retro-yellow' : 'text-gray-300 hover:text-retro-yellow'}`}>
            Sobre
          </Link>

          <Button onClick={handleAdminClick} variant="ghost" size="sm" className="text-gray-400 hover:text-retro-yellow">
            <Settings size={16} />
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-retro-yellow">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-black border-retro-yellow">
              <SheetHeader>
                <SheetTitle className="font-retro text-retro-yellow text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-6 mt-8">
                <a href={latestEpisode?.listen_url || "https://pod.link/1513923155"} target="_blank" rel="noopener noreferrer" className="font-mono text-gray-300 hover:text-retro-yellow transition-colors flex items-center gap-2">
                  🎧 Escute o último episódio
                </a>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-gray-300 hover:text-retro-yellow transition-colors font-mono flex items-center gap-2 justify-start p-0">
                      <Heart size={16} />
                      Apoie o podcast
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black border-retro-yellow max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-retro text-retro-yellow text-center">
                        Ajude a manter o podcast
                      </DialogTitle>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <button onClick={handleTimelineClick} className="font-mono text-gray-300 hover:text-retro-yellow transition-colors">
                  Timeline
                </button>
                <Link to="/propagandas" className="font-mono text-gray-300 hover:text-retro-yellow transition-colors">
                  Propagandas
                </Link>
                <Link to="/sobre" className="font-mono text-gray-300 hover:text-retro-yellow transition-colors">
                  Sobre
                </Link>
                <Button onClick={handleAdminClick} variant="ghost" className="text-gray-300 hover:text-retro-yellow justify-start p-0 font-mono">
                  <Settings size={16} className="mr-2" />
                  Admin
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;