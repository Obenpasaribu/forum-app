export function postedAt(dateString) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return 'baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Thread bodies from the API may contain HTML; convert them to plain text.
export function stripHtml(html) {
  if (!html) return '';
  const spaced = html.replace(/<\/(div|p)>|<br\s*\/?>/gi, ' ');
  const doc = new DOMParser().parseFromString(spaced, 'text/html');
  return doc.body.textContent.replace(/\s+/g, ' ').trim();
}

export function truncate(text, maxLength = 140) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

// Recomputes an upVotesBy/downVotesBy pair after the current user applies a
// vote, used for optimistic UI updates before the server confirms the vote.
export function applyVote({ upVotesBy = [], downVotesBy = [] }, userId, voteType) {
  const nextUp = upVotesBy.filter((id) => id !== userId);
  const nextDown = downVotesBy.filter((id) => id !== userId);

  if (voteType === 1) nextUp.push(userId);
  if (voteType === -1) nextDown.push(userId);

  return { upVotesBy: nextUp, downVotesBy: nextDown };
}

// Returns 1, -1 or 0 depending on how the given user already voted.
export function getVoteType(votable, userId) {
  if (!votable || !userId) return 0;
  if (votable.upVotesBy?.includes(userId)) return 1;
  if (votable.downVotesBy?.includes(userId)) return -1;
  return 0;
}
