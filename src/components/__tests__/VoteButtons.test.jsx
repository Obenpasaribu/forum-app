import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoteButtons from '../VoteButtons';

/**
 * Skenario pengujian komponen VoteButtons:
 *
 * - should render the up and down vote counts correctly
 * - should give the up button the active class when myVote is 1
 * - should give the down button the active class when myVote is -1
 * - should call onUpVote when the up vote button is clicked
 * - should call onDownVote when the down vote button is clicked
 */
describe('VoteButtons component', () => {
  it('should render the up and down vote counts correctly', () => {
    render(
      <VoteButtons upVotesBy={['user-1', 'user-2']} downVotesBy={['user-3']} myVote={0} />,
    );

    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it('should give the up button the active class when myVote is 1', () => {
    render(<VoteButtons upVotesBy={['user-1']} downVotesBy={[]} myVote={1} />);

    const upButton = screen.getByRole('button', { name: /1/ });
    expect(upButton.className).toContain('active');
  });

  it('should give the down button the active class when myVote is -1', () => {
    render(<VoteButtons upVotesBy={[]} downVotesBy={['user-1']} myVote={-1} />);

    const buttons = screen.getAllByRole('button');
    const downButton = buttons.find((button) => button.className.includes('down'));
    expect(downButton.className).toContain('active');
  });

  it('should call onUpVote when the up vote button is clicked', async () => {
    const onUpVote = vi.fn();
    const user = userEvent.setup();
    render(
      <VoteButtons upVotesBy={[]} downVotesBy={[]} myVote={0} onUpVote={onUpVote} onDownVote={() => {}} />,
    );

    const buttons = screen.getAllByRole('button');
    const upButton = buttons.find((button) => button.className.includes('up'));
    await user.click(upButton);

    expect(onUpVote).toHaveBeenCalledTimes(1);
  });

  it('should call onDownVote when the down vote button is clicked', async () => {
    const onDownVote = vi.fn();
    const user = userEvent.setup();
    render(
      <VoteButtons upVotesBy={[]} downVotesBy={[]} myVote={0} onUpVote={() => {}} onDownVote={onDownVote} />,
    );

    const buttons = screen.getAllByRole('button');
    const downButton = buttons.find((button) => button.className.includes('down'));
    await user.click(downButton);

    expect(onDownVote).toHaveBeenCalledTimes(1);
  });
});
