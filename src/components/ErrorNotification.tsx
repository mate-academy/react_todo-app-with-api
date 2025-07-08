import { useTodosContext } from '../context/TodoContextProvider';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodosContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={`
        notification
        is-danger
        is-light
        has-text-weight-normal
        ${errorMessage === null ? 'hidden' : ''}
        `}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
