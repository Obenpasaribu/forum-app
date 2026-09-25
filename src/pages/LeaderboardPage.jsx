import Avatar from '../components/Avatar';
import LoadingBar from '../components/LoadingBar';
import useLeaderboards from '../hooks/useLeaderboards';

function LeaderboardPage() {
  const { data: leaderboards = [], isLoading, isError, error } = useLeaderboards();

  return (
    <div className="app-main">
      <LoadingBar active={isLoading} />
      <h1>Leaderboard</h1>
      <p className="thread-excerpt">Pengguna paling aktif berdasarkan kontribusi di forum.</p>
      {isError && <p className="empty-state">Gagal memuat leaderboard: {error.message}</p>}
      {!isError && leaderboards.length === 0 && !isLoading && (
        <p className="empty-state">Belum ada data leaderboard.</p>
      )}
      <div className="leaderboard-list">
        {leaderboards.map((entry, index) => (
          <div className="leaderboard-row" key={entry.user.id}>
            <span className="leaderboard-rank">{index + 1}</span>
            <Avatar src={entry.user.avatar} name={entry.user.name} size={32} />
            <span className="leaderboard-name">{entry.user.name}</span>
            <span className="leaderboard-score">{entry.score} poin</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardPage;
