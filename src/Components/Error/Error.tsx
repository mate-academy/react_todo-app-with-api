/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, memo, useCallback } from 'react';
import { useTodoContext } from '../../TodoContext/TodoContext';

export const Error: FC = memo(() => {
  const {
    visibleError,
    setVisibleError,
  } = useTodoContext();
  const isVisibleError = visibleError !== null;

  const handleCloseError = useCallback(() => {
    setVisibleError(null);
  }, []);

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
      hidden={!isVisibleError}
    >
      <button
        type="button"
        className="delete"
        onClick={handleCloseError}
      />

      <strong>
        {visibleError}
      </strong>
    </div>
  );
});
