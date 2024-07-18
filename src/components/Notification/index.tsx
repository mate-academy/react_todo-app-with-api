import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessages';

type Props = {
  messageError: string;
  onSetError: (val: ErrorMessage) => void;
};

export const Notification: React.FC<Props> = ({ messageError, onSetError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !messageError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetError(ErrorMessage.Default)}
      />
      {messageError}
      {/* Unable to update a todo */}
    </div>
  );
};
