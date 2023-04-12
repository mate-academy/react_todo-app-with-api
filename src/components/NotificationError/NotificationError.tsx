import classNames from 'classnames';
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
} from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  error: string,
  setError: Dispatch<SetStateAction<Errors>>,
};

export const NotificationError: FC<Props> = ({
  error,
  setError,
}) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(Errors.NONE);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: !error.length,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(Errors.NONE)}
        aria-label="close"
      />
      {error}
    </div>
  );
};
