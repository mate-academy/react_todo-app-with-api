import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  text: string,
};

export const Error: React.FC<Props> = ({
  text,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  setTimeout(() => {
    setIsVisible(false);
  }, 3000);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isVisible },
    )}
    >
      <button
        type="button"
        aria-label="Mute volume"
        className="delete"
        onClick={() => setIsVisible(false)}
      />
      {text}
    </div>
  );
};
