import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
  errorCount: number;
};

const Warning: React.FC<Props> = ({ message, errorCount }) => {
  const [isShown, setIsShown] = useState(false);

  const timer: { current: NodeJS.Timeout | undefined } = useRef(undefined);

  useEffect(() => {
    if (message) {
      setIsShown(true);
      timer.current = setTimeout(() => {
        setIsShown(false);
      }, 3000);
    } else {
      setIsShown(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer.current);
      }
    };
  }, [errorCount]);

  const clickHandler = () => {
    setIsShown(false);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isShown },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide error button"
        onClick={clickHandler}
      />

      {message}
    </div>
  );
};

export default Warning;
