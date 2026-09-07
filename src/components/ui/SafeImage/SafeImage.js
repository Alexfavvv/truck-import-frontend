'use client'
import React, { useState } from 'react';

export default function SafeImage({ src, alt, style, className }) {
  const [error, setError] = useState(false);

  if (error) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      className={className}
      onError={() => setError(true)}
    />
  );
}
