import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentList from '../CommentList';

const comments = [
  {
    id: 'comment-1',
    content: 'Komentar pertama',
    owner: { id: 'user-1', name: 'Alice', avatar: null },
    createdAt: new Date().toISOString(),
    upVotesBy: [],
    downVotesBy: [],
  },
  {
    id: 'comment-2',
    content: 'Komentar kedua',
    owner: { id: 'user-2', name: 'Bono', avatar: null },
    createdAt: new Date().toISOString(),
    upVotesBy: ['user-1'],
    downVotesBy: [],
  },
];

/**
 * Skenario pengujian komponen CommentList:
 *
 * - should render one CommentItem for each comment in the list
 * - should display the empty state message when there are no comments
 * - should call onUpVote with the correct commentId and voteType when a
 *   comment's up vote button is clicked
 * - should call onDownVote with the correct commentId when a comment's
 *   down vote button is clicked
 */
describe('CommentList component', () => {
  it('should render one CommentItem for each comment in the list', () => {
    render(
      <CommentList comments={comments} authUser={null} onUpVote={() => {}} onDownVote={() => {}} />,
    );

    expect(screen.getByText('Komentar pertama')).toBeInTheDocument();
    expect(screen.getByText('Komentar kedua')).toBeInTheDocument();
  });

  it('should display the empty state message when there are no comments', () => {
    render(
      <CommentList comments={[]} authUser={null} onUpVote={() => {}} onDownVote={() => {}} />,
    );

    expect(
      screen.getByText('Belum ada komentar. Jadilah yang pertama menanggapi.'),
    ).toBeInTheDocument();
  });

  it("should call onUpVote with the correct commentId and voteType when a comment's up vote button is clicked", async () => {
    const onUpVote = vi.fn();
    const user = userEvent.setup();
    render(
      <CommentList
        comments={comments}
        authUser={{ id: 'user-9' }}
        onUpVote={onUpVote}
        onDownVote={() => {}}
      />,
    );

    const buttons = screen.getAllByRole('button');
    const upButtons = buttons.filter((button) => button.className.includes('up'));
    await user.click(upButtons[0]);

    expect(onUpVote).toHaveBeenCalledWith('comment-1', 1);
  });

  it("should call onDownVote with the correct commentId when a comment's down vote button is clicked", async () => {
    const onDownVote = vi.fn();
    const user = userEvent.setup();
    render(
      <CommentList
        comments={comments}
        authUser={{ id: 'user-1' }}
        onUpVote={() => {}}
        onDownVote={onDownVote}
      />,
    );

    const buttons = screen.getAllByRole('button');
    const downButtons = buttons.filter((button) => button.className.includes('down'));
    // comments[1] was already up-voted by user-1, so this exercises the
    // "already voted" branch of getVoteType for the second comment.
    await user.click(downButtons[1]);

    expect(onDownVote).toHaveBeenCalledWith('comment-2', -1);
  });
});
