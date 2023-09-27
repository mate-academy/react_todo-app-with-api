import { useTodo } from '../../../context/TodoContext';

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
