import { FormEvent, useContext } from 'react';
import { TodosContext } from '../../TodosContext';

export const TodoErrors: React.FC = () => {
  const {
    errorMessage,
  } = useContext(TodosContext);

  const handleOnClick = (event: FormEvent<HTMLButtonElement>) => {
    event.currentTarget.parentElement?.classList.add('hidden');
  };

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        className="delete"
        aria-label="delete-button"
        onClick={handleOnClick}
      />
      {errorMessage}
    </div>
  );
};
