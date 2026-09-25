import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ThreadItem from '../ThreadItem';

const thread = {
  id: 'thread-1',
  title: 'Bagaimana cara belajar React?',
  body: '<p>Saya baru mulai belajar React, ada saran?</p>',
  category: 'react',
  createdAt: new Date().toISOString(),
  totalComments: 3,
  upVotesBy: ['user-2'],
  downVotesBy: [],
};

function renderThreadItem(overrides = {}) {
  const defaultProps = {
    thread,
    ownerName: 'Budi',
    ownerAvatar: null,
    authUser: null,
    onVote: () => {},
  };
  const props = { ...defaultProps, ...overrides };

  return render(
    <MemoryRouter>
      <ThreadItem
        thread={props.thread}
        ownerName={props.ownerName}
        ownerAvatar={props.ownerAvatar}
        authUser={props.authUser}
        onVote={props.onVote}
      />
    </MemoryRouter>,
  );
}

/**
 * Skenario pengujian komponen ThreadItem:
 *
 * - should render the thread title, category, and author name
 * - should render a link pointing to the thread detail page
 * - should call onVote with voteType 1 when the up vote button is clicked
 *   and the user has not voted yet
 * - should call onVote with voteType 0 when the up vote button is clicked
 *   again by a user who already up-voted (un-voting)
 */
describe('ThreadItem component', () => {
  it('should render the thread title, category, and author name', () => {
    renderThreadItem();

    expect(screen.getByText('Bagaimana cara belajar React?')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('Budi')).toBeInTheDocument();
  });

  it('should render a link pointing to the thread detail page', () => {
    renderThreadItem();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/threads/thread-1');
  });

  it('should call onVote with voteType 1 when the up vote button is clicked and the user has not voted yet', async () => {
    const onVote = vi.fn();
    const user = userEvent.setup();
    renderThreadItem({ authUser: { id: 'user-1' }, onVote });

    const buttons = screen.getAllByRole('button');
    const upButton = buttons.find((button) => button.className.includes('up'));
    await user.click(upButton);

    expect(onVote).toHaveBeenCalledWith('thread-1', 1);
  });

  it('should call onVote with voteType 0 when the up vote button is clicked again by a user who already up-voted (un-voting)', async () => {
    const onVote = vi.fn();
    const user = userEvent.setup();
    renderThreadItem({ authUser: { id: 'user-2' }, onVote });

    const buttons = screen.getAllByRole('button');
    const upButton = buttons.find((button) => button.className.includes('up'));
    await user.click(upButton);

    expect(onVote).toHaveBeenCalledWith('thread-1', 0);
  });
});
