import { useContext, useEffect, useRef } from 'react';
import { TodosContext } from '../../TodosContext';

export const TodoForm: React.FC = () => {
  const todosContext = useContext(TodosContext);

  const {
    todos,
    title,
    setTitle,
    statusResponse,
    addTodo,
  } = todosContext;

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [statusResponse, title, todos]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    addTodo();
  }

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        data-cy="NewTodoField"
        ref={inputField}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={statusResponse}
      />
    </form>
  );
};
