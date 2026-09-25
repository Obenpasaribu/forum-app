import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import VoteButtons from './VoteButtons';
import {
  postedAt, truncate, stripHtml, getVoteType,
} from '../utils';

function ThreadItem({
  thread, ownerName, ownerAvatar, authUser, onVote,
}) {
  const myVote = getVoteType(thread, authUser?.id);

  return (
    <article className="thread-item">
      <Link className="thread-link" to={`/threads/${thread.id}`}>
        {thread.category && <span className="thread-category">{thread.category}</span>}
        <h3>{thread.title}</h3>
        {thread.body && <p className="thread-excerpt">{truncate(stripHtml(thread.body))}</p>}
      </Link>
      <div className="thread-meta">
        <VoteButtons
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          myVote={myVote}
          onUpVote={() => onVote(thread.id, myVote === 1 ? 0 : 1)}
          onDownVote={() => onVote(thread.id, myVote === -1 ? 0 : -1)}
        />
        <span className="meta-author">
          <Avatar src={ownerAvatar} name={ownerName} size={20} />
          {ownerName}
        </span>
        <span>{postedAt(thread.createdAt)}</span>
        <span>{thread.totalComments} komentar</span>
      </div>
    </article>
  );
}

export default ThreadItem;
