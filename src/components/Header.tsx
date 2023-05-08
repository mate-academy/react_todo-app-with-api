import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { createTodo } from '../api/todos';
import { Errors } from '../utils/Errors';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  todos: Todo[],
  setError: React.Dispatch<React.SetStateAction<Errors>>,
  isLoading: boolean,
  handleCompleteAll: () => Promise<void>,
};

export const Header: React.FC<Props> = ({
  setTodos,
  todos,
  setError,
  isLoading,
  handleCompleteAll,
}) => {
  const [newTodo, setNewTodo] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodo.trim();

    if (!trimmedTitle) {
      setError(Errors.EmptyTitle);

      return;
    }

    const newTodoItem: Todo = {
      id: 0,
      userId: 9934,
      title: newTodo.trim(),
      completed: false,
    };

    try {
      const createdTodo = await createTodo(9934, newTodoItem);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch {
      setError(Errors.Adding);
    }

    setNewTodo('');
  };

  const allChecked = todos
    .filter(todo => todo.completed).length === todos.length;

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        /* eslint-disable jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            (allChecked && 'active'),
          )}
          onClick={handleCompleteAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
