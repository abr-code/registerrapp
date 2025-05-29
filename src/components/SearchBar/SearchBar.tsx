import { type ChangeEvent, useState } from 'react';
import type { Member } from '../../types/Member';
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (query: string, field?: keyof Member) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState('');
    const [searchField, setSearchField] = useState<keyof Member | ''>('');

    const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value, searchField as keyof Member || undefined);
    };

    const handleFieldChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as keyof Member | '';
        setSearchField(value);
        onSearch(query, value || undefined);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={handleQueryChange}
                className="search-input"
            />
            <select 
                value={searchField} 
                onChange={handleFieldChange}
                className="search-select"
            >
                <option value="">Todos los campos</option>
                <option value="fullName">Nombre completo</option>
                <option value="date">Fecha</option>
                <option value="type">Tipo</option>
                <option value="age">Edad</option>
                <option value="phone">Teléfono</option>
                <option value="email">Correo electrónico</option>
                <option value="address">Dirección</option>
                <option value="invitedBy">Invitado por</option>
            </select>
        </div>
    );
};
