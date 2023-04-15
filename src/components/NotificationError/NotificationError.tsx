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
  onClose: Dispatch<SetStateAction<Errors>>,
};

export const NotificationError: FC<Props> = ({
  error,
  onClose,
}) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose(Errors.NONE);
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
        onClick={() => onClose(Errors.NONE)}
        aria-label="close"
      />
      {error}
    </div>
  );
};
