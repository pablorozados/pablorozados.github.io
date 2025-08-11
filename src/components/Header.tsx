
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Settings, Heart, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEpisodes } from '@/hooks/useEpisodes';

interface HeaderProps {
  onAdminClick: () => void;
}

const Header = ({ onAdminClick }: HeaderProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { episodes } = useEpisodes();

  // Obter o último episódio (mais recente)
  const latestEpisode = episodes.length > 0 ? episodes.reduce((latest, current) => {
    return current.year > latest.year ? current : latest;
  }) : null;

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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-retro-yellow transition-colors font-mono text-xs flex items-center gap-2"
              >
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
              <div className="flex flex-col items-center space-y-4 p-4">
                <img 
                  src="/lovable-uploads/c603ed23-7c97-4397-98a9-2c6a61335b95.png"
                  alt="QR Code Pix para doação"
                  className="w-80 h-80 object-contain"
                />
                <p className="font-mono text-gray-300 text-center text-sm">
                  Use o Pix para contribuir com qualquer valor e ajudar a manter o podcast no ar!
                </p>
                
                <div className="w-full space-y-2">
                  <p className="font-mono text-gray-300 text-center text-xs">
                    Ou use o código Pix copia e cola:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="00020101021126580014br.gov.bcb.pix0136bdde579d-62ba-49aa-9e5f-914c4f739d0c5204000053039865802BR5919PABLO FROTA ROZADOS6012PORTO ALEGRE62070503***63046CE2"
                      readOnly
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs font-mono text-gray-300 truncate"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText("00020101021126580014br.gov.bcb.pix0136bdde579d-62ba-49aa-9e5f-914c4f739d0c5204000053039865802BR5919PABLO FROTA ROZADOS6012PORTO ALEGRE62070503***63046CE2");
                        toast({
                          description: "Código copiado!",
                        });
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <a 
            href="/#timeline" 
            className="font-mono text-gray-300 hover:text-retro-yellow transition-colors"
          >
            Timeline
          </a>
          <Link 
            to="/propagandas" 
            className={`font-mono transition-colors ${
              location.pathname === '/propagandas' 
                ? 'text-retro-yellow' 
                : 'text-gray-300 hover:text-retro-yellow'
            }`}
          >
            Propagandas
          </Link>
          <Link 
            to="/sobre" 
            className={`font-mono transition-colors ${
              location.pathname === '/sobre' 
                ? 'text-retro-yellow' 
                : 'text-gray-300 hover:text-retro-yellow'
            }`}
          >
            Sobre
          </Link>
          <Button
            onClick={onAdminClick}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-retro-yellow"
          >
            <Settings size={16} />
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-retro-yellow"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-black border-retro-yellow">
              <SheetHeader>
                <SheetTitle className="font-retro text-retro-yellow text-left">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-6 mt-8">
                <a 
                  href={latestEpisode?.listen_url || "https://pod.link/1513923155"} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-gray-300 hover:text-retro-yellow transition-colors flex items-center gap-2"
                >
                  🎧 Escute o último episódio
                </a>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-retro-yellow transition-colors font-mono flex items-center gap-2 justify-start p-0"
                    >
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
                    <div className="flex flex-col items-center space-y-4 p-4">
                      <img 
                        src="/lovable-uploads/c603ed23-7c97-4397-98a9-2c6a61335b95.png"
                        alt="QR Code Pix para doação"
                        className="w-80 h-80 object-contain"
                      />
                      <p className="font-mono text-gray-300 text-center text-sm">
                        Use o Pix para contribuir com qualquer valor e ajudar a manter o podcast no ar!
                      </p>
                      
                      <div className="w-full space-y-2">
                        <p className="font-mono text-gray-300 text-center text-xs">
                          Ou use o código Pix copia e cola:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value="00020101021126580014br.gov.bcb.pix0136bdde579d-62ba-49aa-9e5f-914c4f739d0c5204000053039865802BR5919PABLO FROTA ROZADOS6012PORTO ALEGRE62070503***63046CE2"
                            readOnly
                            className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs font-mono text-gray-300 truncate"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText("00020101021126580014br.gov.bcb.pix0136bdde579d-62ba-49aa-9e5f-914c4f739d0c5204000053039865802BR5919PABLO FROTA ROZADOS6012PORTO ALEGRE62070503***63046CE2");
                              toast({
                                description: "Código copiado!",
                              });
                            }}
                          >
                            Copiar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <a 
                  href="/#timeline" 
                  className="font-mono text-gray-300 hover:text-retro-yellow transition-colors"
                >
                  Timeline
                </a>
                <Link 
                  to="/propagandas" 
                  className={`font-mono transition-colors ${
                    location.pathname === '/propagandas' 
                      ? 'text-retro-yellow' 
                      : 'text-gray-300 hover:text-retro-yellow'
                  }`}
                >
                  Propagandas
                </Link>
                <Link 
                  to="/sobre" 
                  className={`font-mono transition-colors ${
                    location.pathname === '/sobre' 
                      ? 'text-retro-yellow' 
                      : 'text-gray-300 hover:text-retro-yellow'
                  }`}
                >
                  Sobre
                </Link>
                <Button
                  onClick={onAdminClick}
                  variant="ghost"
                  className="text-gray-300 hover:text-retro-yellow justify-start p-0 font-mono"
                >
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
