import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { updateTodo, USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  todoList: Todo[];
  loadingState: boolean;
  setTodoList: (todos: Todo[]) => void;
  setTodos: (todos: Todo[]) => void;
  addTodo: (
    tempTodoTitle: string,
    { userId, title, completed }: Omit<Todo, 'id'>,
  ) => Promise<void>;
  setLoading: (value: boolean) => void;
  setActiveTodos: (todo: Todo[]) => void;
  errorFunction?: (message: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  todoList,
  loadingState,
  setLoading,
  setTodoList,
  setTodos,
  addTodo,
  setActiveTodos,
  errorFunction = () => {},
}) => {
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !loadingState) {
      inputRef.current.focus();
    }
  }, [loadingState]);

  const checkActiveTodos = useCallback((): boolean => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newValue = event.target.value;

    setQuery(newValue);
    errorFunction('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    errorFunction('');
    const normalizedQuery = query.trim();

    if (normalizedQuery) {
      const result = addTodo(normalizedQuery, {
        userId: USER_ID,
        title: normalizedQuery,
        completed: false,
      });

      if (result instanceof Promise) {
        result
          .then(() => setQuery(''))
          .catch(() => {
            errorFunction('Unable to add a todo');
            setTodoList(todos.filter(todo => todo.id !== 0));
          });
      }
    } else {
      errorFunction('Title should not be empty');
    }
  };

  const toggleAllFunction = async () => {
    let todosToUpdate: Todo[] = todoList;
    const updatedTodos: Todo[] = [];

    if (!checkActiveTodos()) {
      todosToUpdate = todos.filter(todo => !todo.completed);
    }

    setActiveTodos([...todosToUpdate]);

    for (const currentTodo of todosToUpdate) {
      const tempTodo: Todo = {
        id: currentTodo.id,
        title: currentTodo.title,
        userId: currentTodo.userId,
        completed: currentTodo.completed ? false : true,
      };

      try {
        const updatedTodo = await updateTodo(tempTodo);

        updatedTodos.push(updatedTodo);
      } catch (error) {
        throw error;
      }
    }

    return updatedTodos;
  };

  const handleToggleAll = async () => {
    setLoading(true);

    return toggleAllFunction().then(updatedTodos => {
      try {
        const newTodos = [...todos];

        updatedTodos.forEach(updatedTodo => {
          const index = todos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);
        });

        setTodos(newTodos);
      } catch {
        errorFunction('Unable to update todos');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: checkActiveTodos(),
          })}
          onClick={handleToggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          id="createTodoInput"
          ref={inputRef}
          value={query}
          onChange={event => onInputChange(event)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loadingState}
        />
      </form>
    </header>
  );
};
