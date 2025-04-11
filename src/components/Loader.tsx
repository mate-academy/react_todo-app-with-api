import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => (
  <div className="loader">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);
