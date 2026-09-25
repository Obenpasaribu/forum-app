function VoteButtons({ upVotesBy = [], downVotesBy = [], myVote, onUpVote, onDownVote }) {
  return (
    <div className="vote-buttons">
      <button
        type="button"
        className={`vote-btn up ${myVote === 1 ? 'active' : ''}`}
        onClick={onUpVote}
      >
        &#9650; {upVotesBy.length}
      </button>
      <button
        type="button"
        className={`vote-btn down ${myVote === -1 ? 'active' : ''}`}
        onClick={onDownVote}
      >
        &#9660; {downVotesBy.length}
      </button>
    </div>
  );
}

export default VoteButtons;
