import { FC } from 'react';

type Props = {
  onClose: () => void;
  closeError: () => void;
  errorMessage: string;
};

export const ErrorNotification: FC<Props> = ({
  onClose,
  closeError,
  errorMessage,
}) => {
  onClose();

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />

      <span>{errorMessage}</span>
    </div>
  );
};
