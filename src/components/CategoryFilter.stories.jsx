import { useState } from 'react';
import CategoryFilter from './CategoryFilter';

export default {
  title: 'Components/CategoryFilter',
  component: CategoryFilter,
  tags: ['autodocs'],
};

export const NoCategories = {
  args: {
    categories: [],
    activeCategory: null,
    onChange: () => {},
  },
};

export const AllSelected = {
  args: {
    categories: ['react', 'redux', 'javascript', 'css'],
    activeCategory: null,
    onChange: () => {},
  },
};

export const CategorySelected = {
  args: {
    categories: ['react', 'redux', 'javascript', 'css'],
    activeCategory: 'redux',
    onChange: () => {},
  },
};

export function Interactive() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <CategoryFilter
      categories={['react', 'redux', 'javascript', 'css']}
      activeCategory={activeCategory}
      onChange={setActiveCategory}
    />
  );
}
