import classNames from 'classnames';
import {
  memo,
  useEffect,
  useRef,
} from 'react';

type Props = {
  errorType: string,
  onErrorTypeChange: (error: string) => void,
};

export const ErrorNotification: React.FC<Props> = memo(({
  errorType,
  onErrorTypeChange,
}) => {
  const isHidden = !errorType.length;
  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (!isHidden) {
      timerRef.current = setTimeout(() => {
        onErrorTypeChange('');
      }, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [errorType]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide error notification"
        onClick={() => onErrorTypeChange('')}
      />
      {errorType}
    </div>
  );
});
