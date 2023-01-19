/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  hidden: boolean;
  setHidden: (arg: boolean) => void;
  onError: string;
};

export const ErrorNotification: React.FC<Props> = (
  {
    hidden,
    setHidden,
    onError,
  },
) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHidden(true)}
      />
      {onError === ErrorType.add && 'Unable to add a todo'}

      {onError === ErrorType.delete && 'Unable to delete a todo'}

      {onError === ErrorType.update && 'Unable to update a todo'}

      {onError === ErrorType.empty && 'Title can\'t be empty'}
    </div>
  );
};
