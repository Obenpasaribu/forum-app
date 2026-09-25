import Avatar from './Avatar';
import VoteButtons from './VoteButtons';
import { postedAt, getVoteType } from '../utils';

function CommentItem({ comment, authUser, onUpVote, onDownVote }) {
  const myVote = getVoteType(comment, authUser?.id);

  return (
    <div className="comment-item">
      <div className="comment-head">
        <Avatar src={comment.owner?.avatar} name={comment.owner?.name} size={22} />
        <strong>{comment.owner?.name}</strong>
        <span>&middot;</span>
        <span>{postedAt(comment.createdAt)}</span>
      </div>
      <p className="comment-content">{comment.content}</p>
      <VoteButtons
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
        myVote={myVote}
        onUpVote={() => onUpVote(comment.id, myVote === 1 ? 0 : 1)}
        onDownVote={() => onDownVote(comment.id, myVote === -1 ? 0 : -1)}
      />
    </div>
  );
}

export default CommentItem;
