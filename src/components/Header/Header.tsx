import {
  FC, FormEvent, useCallback, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/enums';
import { TodoData } from '../../types/TodoData';
import { createTodo } from '../../api/todos';
import { USER_ID } from '../../utils/UserId';

interface Props {
  todos: Todo[];
  onAdd: (newTodo: Todo) => void;
  setError: (error: null | Errors) => void;
  setTempTodo: (newTodo: Todo | null) => void;
  loadTodos: () => void;
  setTodos: (newTodos: Todo[]) => void;
}

export const Header:FC<Props> = ({
  todos,
  onAdd,
  setError,
  setTempTodo,
  loadTodos,
  setTodos,
}) => {
  const [query, setQuery] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!query) {
      setError(Errors.Title);

      return;
    }

    const todoData: TodoData = {
      completed: false,
      title: query,
      userId: USER_ID,
    };

    setTempTodo({ ...todoData, id: 0 });
    try {
      setIsDisabled(true);
      const newTodo = await createTodo(todoData);

      onAdd(newTodo);
      setQuery('');
    } catch {
      setError(Errors.Add);
    } finally {
      loadTodos();
      setTempTodo(null);
      setIsDisabled(false);
    }
  }, [
    query,
    setError,
    setTempTodo,
    loadTodos,
    onAdd,
  ]);

  const handleAllTodosUpdate = () => {
    const updatedTodos = todos.map((todo) => {
      if (todo.completed) {
        return { ...todo, completed: false };
      }

      return { ...todo, completed: true };
    });

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="button"
          type="button"
          className="todoapp__toggle-all active"
          onClick={handleAllTodosUpdate}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setError(null);
          }}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
