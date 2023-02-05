import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

type Props = {
  visible: boolean,
  message: string,
  onClear: () => void,
};

export const Notification: React.FC<Props> = React.memo(
  ({
    visible,
    message,
    onClear,
  }) => {
    const timer = useRef<NodeJS.Timer>();

    useEffect(() => {
      if (visible) {
        timer.current = setInterval(onClear, 3000);
      }

      return () => clearInterval(timer.current);
    });

    return (
      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !visible },
      )}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className="delete"
          onClick={onClear}
        />
        {message}
      </div>
    );
  },
);
