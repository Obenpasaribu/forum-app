import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from '../CategoryFilter';

/**
 * Skenario pengujian komponen CategoryFilter:
 *
 * - should render nothing when the categories list is empty
 * - should render a chip for every category plus the "Semua" chip
 * - should mark the active category chip with the active class
 * - should call onChange with the clicked category
 * - should call onChange with null when the "Semua" chip is clicked
 */
describe('CategoryFilter component', () => {
  it('should render nothing when the categories list is empty', () => {
    const { container } = render(
      <CategoryFilter categories={[]} activeCategory={null} onChange={() => {}} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render a chip for every category plus the "Semua" chip', () => {
    render(
      <CategoryFilter categories={['react', 'redux']} activeCategory={null} onChange={() => {}} />,
    );

    expect(screen.getByText('Semua')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('redux')).toBeInTheDocument();
  });

  it('should mark the active category chip with the active class', () => {
    render(
      <CategoryFilter categories={['react', 'redux']} activeCategory="redux" onChange={() => {}} />,
    );

    expect(screen.getByText('redux').className).toContain('active');
    expect(screen.getByText('react').className).not.toContain('active');
  });

  it('should call onChange with the clicked category', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CategoryFilter categories={['react', 'redux']} activeCategory={null} onChange={onChange} />,
    );

    await user.click(screen.getByText('redux'));

    expect(onChange).toHaveBeenCalledWith('redux');
  });

  it('should call onChange with null when the "Semua" chip is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CategoryFilter categories={['react']} activeCategory="react" onChange={onChange} />,
    );

    await user.click(screen.getByText('Semua'));

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
