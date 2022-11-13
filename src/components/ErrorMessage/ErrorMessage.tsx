/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, memo } from 'react';

type Props = {
  errorNotification: string;
  errorChange: () => void;
};

export const ErrorMessage: FC<Props> = memo(({
  errorNotification,
  errorChange,
}) => (
  <div
    data-cy="ErrorNotification"
    className="notification is-danger is-light has-text-weight-normal"
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => errorChange()}
    />
    {errorNotification}
  </div>
));
