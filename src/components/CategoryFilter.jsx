function CategoryFilter({ categories, activeCategory, onChange }) {
  if (categories.length === 0) return null;

  return (
    <div className="category-filter">
      <button
        type="button"
        className={`category-chip ${!activeCategory ? 'active' : ''}`}
        onClick={() => onChange(null)}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          className={`category-chip ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
