/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  isHidden: boolean;
  setIsHidden: (arg: boolean) => void;
  onError: string;
};

export const ErrorNotification: React.FC<Props> = (
  {
    isHidden,
    setIsHidden,
    onError,
  },
) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {onError === ErrorType.load && 'Unable to load a todos'}

      {onError === ErrorType.add && 'Unable to add a todo'}

      {onError === ErrorType.delete && 'Unable to delete a todo'}

      {onError === ErrorType.update && 'Unable to update a todo'}

      {onError === ErrorType.empty && 'Title can\'t be empty'}
    </div>
  );
};
