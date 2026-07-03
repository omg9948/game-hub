'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-container">
      <i className="fas fa-search search-icon"></i>
      <input
        type="text"
        className="search-input"
        id="searchInput"
        placeholder="ค้นหาเกม..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
