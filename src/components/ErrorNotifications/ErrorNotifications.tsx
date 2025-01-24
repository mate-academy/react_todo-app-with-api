import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { handleErrorNotification } from '../../features/todosSlice';

export const ErrorNotifications: React.FC = () => {
  const errorMessage = useAppSelector(state => state.todos.error);

  const dispatch = useAppDispatch();

  const hideErrorNotification = () => {
    dispatch(handleErrorNotification(''));
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        'notification is-danger is-light has-text-weight-normal ' +
        (!errorMessage ? 'hidden' : '')
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideErrorNotification}
      />
      {errorMessage}
    </div>
  );
};
