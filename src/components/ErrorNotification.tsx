import classNames from 'classnames';

import { ErrorMessage } from '../types';

type Props = {
  message: ErrorMessage;
  onHide: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onHide }) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !message },
    )}
  >
    <button
      type="button"
      className="delete"
      aria-label="Hide Error"
      data-cy="HideErrorButton"
      onClick={() => onHide()}
    />
    {message}
  </div>
);
