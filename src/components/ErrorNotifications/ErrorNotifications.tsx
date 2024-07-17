import { useDispatch, useGlobalState } from '../../GlobalStateProvider';
import { Type } from '../../types/Action';

export const ErrorNotifications: React.FC = () => {
  const { errorMessage } = useGlobalState();
  const dispatch = useDispatch();

  const handleHideError = () => {
    dispatch({ type: Type.setErrorMessage, payload: '' });
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
        onClick={handleHideError}
      />
      {errorMessage}
    </div>
  );
};
