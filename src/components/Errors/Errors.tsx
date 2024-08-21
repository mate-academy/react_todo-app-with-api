import * as React from 'react';
import { IsActiveError } from '../../types/types';
import classNames from 'classnames';
import { useAppDispatch } from '../../app/hooks';
import { setNewError } from '../../app/features/todosSlice';

interface Props {
  hasError: IsActiveError;
}

export const Errors: React.FC<Props> = ({ hasError }) => {
  const dispatch = useAppDispatch();

  const errorMessage = React.useMemo(() => {
    return Object.values(IsActiveError).find(item => item === hasError);
  }, [hasError]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setNewError(IsActiveError.NoError));
    }, 3000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: hasError === IsActiveError.NoError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => dispatch(setNewError(IsActiveError.NoError))}
      />
      {errorMessage}
    </div>
  );
};
