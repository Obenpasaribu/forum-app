import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ThreadList from '../components/ThreadList';
import CategoryFilter from '../components/CategoryFilter';
import LoadingBar from '../components/LoadingBar';
import { asyncReceiveThreads, asyncVoteThread } from '../states/threads/action';
import { asyncReceiveUsers } from '../states/users/action';

function HomePage() {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.threads);
  const users = useSelector((state) => state.users);
  const authUser = useSelector((state) => state.authUser);
  const isLoading = useSelector((state) => state.loading.threads);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    dispatch(asyncReceiveThreads());
    dispatch(asyncReceiveUsers());
  }, [dispatch]);

  const categories = useMemo(
    () => [...new Set(threads.map((thread) => thread.category).filter(Boolean))],
    [threads],
  );

  const visibleThreads = useMemo(() => {
    if (!activeCategory) return threads;
    return threads.filter((thread) => thread.category === activeCategory);
  }, [threads, activeCategory]);

  return (
    <div className="app-main">
      <LoadingBar active={isLoading} />
      <div className="page-title-row">
        <h1>Thread Diskusi</h1>
      </div>
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />
      <ThreadList
        threads={visibleThreads}
        users={users}
        authUser={authUser}
        onVote={(threadId, voteType) => dispatch(asyncVoteThread(threadId, voteType))}
      />
    </div>
  );
}

export default HomePage;
