import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ThreadList from '../ThreadList';

const threads = [
  {
    id: 'thread-1',
    title: 'Thread Pertama',
    body: 'Isi thread pertama',
    category: 'umum',
    ownerId: 'user-1',
    createdAt: new Date().toISOString(),
    totalComments: 2,
    upVotesBy: [],
    downVotesBy: [],
  },
  {
    id: 'thread-2',
    title: 'Thread Kedua',
    body: 'Isi thread kedua',
    category: 'umum',
    ownerId: 'user-2',
    createdAt: new Date().toISOString(),
    totalComments: 0,
    upVotesBy: [],
    downVotesBy: [],
  },
];

const users = [
  { id: 'user-1', name: 'Alice', avatar: null },
  { id: 'user-2', name: 'Bono', avatar: null },
];

function renderThreadList(overrides = {}) {
  const defaultProps = {
    threads, users, authUser: null, onVote: () => {},
  };
  const props = { ...defaultProps, ...overrides };

  return render(
    <MemoryRouter>
      <ThreadList {...props} />
    </MemoryRouter>,
  );
}

/**
 * Skenario pengujian komponen ThreadList:
 *
 * - should render one ThreadItem for each thread in the list
 * - should resolve and display the correct owner name for each thread
 * - should display a fallback owner name when the owner cannot be found in users
 * - should display an empty state message when the threads list is empty
 * - should call onVote with the correct thread id when a vote button is clicked
 */
describe('ThreadList component', () => {
  it('should render one ThreadItem for each thread in the list', () => {
    renderThreadList();

    expect(screen.getByText('Thread Pertama')).toBeInTheDocument();
    expect(screen.getByText('Thread Kedua')).toBeInTheDocument();
  });

  it('should resolve and display the correct owner name for each thread', () => {
    renderThreadList();

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bono')).toBeInTheDocument();
  });

  it('should display a fallback owner name when the owner cannot be found in users', () => {
    const orphanThread = [{ ...threads[0], ownerId: 'user-unknown' }];

    renderThreadList({ threads: orphanThread });

    expect(screen.getByText('Pengguna')).toBeInTheDocument();
  });

  it('should display an empty state message when the threads list is empty', () => {
    renderThreadList({ threads: [] });

    expect(screen.getByText('Belum ada thread pada kategori ini.')).toBeInTheDocument();
  });

  it('should call onVote with the correct thread id when a vote button is clicked', async () => {
    const onVote = vi.fn();
    const user = userEvent.setup();
    renderThreadList({ authUser: { id: 'user-9' }, onVote });

    const buttons = screen.getAllByRole('button');
    const upButtons = buttons.filter((button) => button.className.includes('up'));
    await user.click(upButtons[1]);

    expect(onVote).toHaveBeenCalledWith('thread-2', 1);
  });
});
