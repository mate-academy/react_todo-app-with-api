/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, memo, useCallback } from 'react';
import { NewError } from '../../types/ErrorsList';

interface Props {
  visibleError: NewError | null;
  onCloseError: () => void;
}

export const Error: FC<Props> = memo(({
  visibleError, onCloseError,
}) => {
  const isVisibleError = visibleError !== null;

  const handleCloseError = useCallback(() => {
    onCloseError();
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
