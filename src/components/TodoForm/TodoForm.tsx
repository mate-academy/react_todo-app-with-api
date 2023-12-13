import {
  useContext, useEffect, useRef,
} from 'react';
import { TodosContext } from '../../TodosContext';

export const TodoForm: React.FC = () => {
  const todosContext = useContext(TodosContext);

  const {
    todos,
    title,
    setTitle,
    statusResponce,
    addTodo,
  } = todosContext;

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [statusResponce, title, todos]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={statusResponce}
      />
    </form>
  );
};
