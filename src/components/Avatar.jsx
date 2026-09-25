import { useState } from 'react';

function Avatar({ src, name, size = 28 }) {
  const [hasError, setHasError] = useState(false);
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=e7efec&color=2f6f5e`;

  return (
    <img
      className="avatar"
      src={hasError || !src ? fallback : src}
      alt={name}
      width={size}
      height={size}
      onError={() => setHasError(true)}
    />
  );
}

export default Avatar;
