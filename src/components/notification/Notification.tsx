import { useEffect, memo } from 'react';
import cn from 'classnames';

interface Props {
  setError: (errVal: string) => void;
  errorText: string | true;
}

export const Notification: React.FC<Props> = memo(({ errorText, setError }) => {
  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  return (
    <div className={
      cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorText === '',
      })
    }
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => {
          setError('');
        }}
      />
      {errorText}
    </div>
  );
});
