function LoadingBar({ active }) {
  if (!active) return null;
  return <div className="loading-bar" role="status" aria-label="Memuat data" />;
}

export default LoadingBar;
