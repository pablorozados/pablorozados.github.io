import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  label?: string;
}

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Digite para buscar...",
  label = "Buscar"
}: SearchFilterProps) => {
  return (
    <div className="w-full max-w-md">
      <Label htmlFor="search" className="font-mono text-gray-300 mb-2 block">
        {label}
      </Label>
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 bg-retro-black border-retro-blue text-white placeholder-gray-400 focus:border-retro-yellow"
        />
      </div>
    </div>
  );
};

export default SearchFilter;