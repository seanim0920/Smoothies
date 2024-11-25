export const SearchBar = ({ onSearch }: {onSearch: (query: string) => void}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search smoothies..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
