import CommentItem from './CommentItem';

function CommentList({ comments, authUser, onUpVote, onDownVote }) {
  if (comments.length === 0) {
    return <p className="empty-state">Belum ada komentar. Jadilah yang pertama menanggapi.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          authUser={authUser}
          onUpVote={onUpVote}
          onDownVote={onDownVote}
        />
      ))}
    </div>
  );
}

export default CommentList;
