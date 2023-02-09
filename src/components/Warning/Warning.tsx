import { useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
  errorCount: number;
};

const Warning: React.FC<Props> = ({ message, errorCount }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (message) {
      setIsShown(true);
      timer = setTimeout(() => {
        setIsShown(false);
      }, 3000);
    } else {
      setIsShown(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
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
