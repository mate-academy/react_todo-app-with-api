import React, { useEffect, useState } from 'react';
import { useTodos } from '../Store/Store';

const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodos();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (errorMessage !== '') {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage, setErrorMessage]);

  const handleChange = () => {
    setErrorMessage('');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleChange}
      />
      {errorMessage}
    </div>
  );
};

export default ErrorNotification;
