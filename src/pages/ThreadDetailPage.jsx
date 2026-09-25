import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import VoteButtons from '../components/VoteButtons';
import CommentList from '../components/CommentList';
import LoadingBar from '../components/LoadingBar';
import { postedAt, getVoteType, stripHtml } from '../utils';
import { asyncReceiveThreadDetail, asyncAddComment, asyncVoteThreadDetail, asyncVoteComment } from '../states/threadDetail/action';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const thread = useSelector((state) => state.threadDetail);
  const authUser = useSelector((state) => state.authUser);
  const isLoading = useSelector((state) => state.loading.threadDetail);
  const isSubmitting = useSelector((state) => state.loading.submit);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(threadId));
  }, [dispatch, threadId]);

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    await dispatch(asyncAddComment(threadId, commentText.trim()));
    setCommentText('');
  };

  if (isLoading || !thread) {
    return (
      <div className="app-main">
        <LoadingBar active={isLoading} />
        {!isLoading && <p className="empty-state">Thread tidak ditemukan.</p>}
      </div>
    );
  }

  const myVote = getVoteType(thread, authUser?.id);

  return (
    <div className="app-main">
      <LoadingBar active={isLoading} />
      <div className="thread-detail-header">
        {thread.category && <span className="thread-category">{thread.category}</span>}
        <h1>{thread.title}</h1>
        <div className="thread-meta">
          <span className="meta-author">
            <Avatar src={thread.owner?.avatar} name={thread.owner?.name} size={22} />
            {thread.owner?.name}
          </span>
          <span>{postedAt(thread.createdAt)}</span>
        </div>
        <p className="thread-detail-body">{stripHtml(thread.body)}</p>
        <VoteButtons
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          myVote={myVote}
          onUpVote={() => dispatch(asyncVoteThreadDetail(threadId, myVote === 1 ? 0 : 1))}
          onDownVote={() => dispatch(asyncVoteThreadDetail(threadId, myVote === -1 ? 0 : -1))}
        />
      </div>

      <div className="comment-section">
        <h2>{thread.comments.length} Komentar</h2>

        {authUser ? (
          <form onSubmit={handleAddComment} className="field" style={{ marginBottom: 24 }}>
            <label htmlFor="comment">Tulis komentar</label>
            <textarea
              id="comment"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Bagikan pendapat Anda…"
            />
            <button className="btn" type="submit" disabled={isSubmitting} style={{ marginTop: 10 }}>
              {isSubmitting ? 'Mengirim…' : 'Kirim Komentar'}
            </button>
          </form>
        ) : (
          <p className="empty-state">Masuk untuk ikut berkomentar.</p>
        )}

        <CommentList
          comments={thread.comments}
          authUser={authUser}
          onUpVote={(commentId, voteType) => dispatch(asyncVoteComment(threadId, commentId, voteType))}
          onDownVote={(commentId, voteType) => dispatch(asyncVoteComment(threadId, commentId, voteType))}
        />
      </div>
    </div>
  );
}

export default ThreadDetailPage;
