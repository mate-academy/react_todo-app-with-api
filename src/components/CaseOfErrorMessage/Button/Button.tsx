import { useTodo } from '../../../provider/todoProvider';

export const Button = () => {
  const { closeErrorMessage } = useTodo();

  return (
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={closeErrorMessage}
      aria-label="Close Error"
    />
  );
};
