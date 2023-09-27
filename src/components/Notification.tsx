/* eslint-disable jsx-a11y/control-has-associated-label */
import { ActionError } from '../types/ActionError';

interface NotificationProps {
  errorMessage: ActionError
}

export const Notification = ({ errorMessage }: NotificationProps) => {
  const className = `notification is-danger is-light has-text-weight-normal' ${errorMessage ? '' : 'hidden'}`;

  return (
    <div className={className}>
      <button type="button" className="delete" />
      {errorMessage}
      <br />
    </div>
  );
};
