import classNames from 'classnames';
import { ErrorsType } from '../types/Errors';

type Props = {
  errors: ErrorsType;
  handleHideError: () => void;
};

export const Errors: React.FC<Props> = ({ errors, handleHideError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden:
            !errors.addTodoError &&
            !errors.deleteTodoError &&
            !errors.loadError &&
            !errors.titleError &&
            !errors.updateTodoError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        onClick={handleHideError}
        className="delete"
      />
      {errors.loadError && 'Unable to load todos'}
      {errors.titleError && 'Title should not be empty'}
      {errors.addTodoError && 'Unable to add a todo'}
      {errors.deleteTodoError && 'Unable to delete a todo'}
      {errors.updateTodoError && 'Unable to update a todo'}
    </div>
  );
};
