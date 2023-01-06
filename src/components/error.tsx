import { FC, memo } from 'react';

interface Props {
  onClose: (value: React.SetStateAction<boolean>) => void,
  isVisible: boolean,
  errorText: string,
}

export const Error: FC<Props> = memo(
  ({
    onClose,
    isVisible,
    errorText,
  }) => (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={isVisible}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClose(true)}
      />
      {errorText}
    </div>
  ),
);
