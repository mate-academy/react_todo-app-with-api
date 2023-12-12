import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodosContext, USER_ID } from '../TodosContext/TodosContext';
import { ErrorMessage } from '../../types/ErrorMessages';
import { Todo } from '../../types/Todo';
import { addTodo, updateTodo } from '../../api/todos';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    handleSetError,
    isError,
    setTempTodo,
    tempUpdating,
    setTempUpdating,
  } = useContext(TodosContext);

  const [query, setQuery] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const addTodoQuery = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addTodoQuery.current) {
      addTodoQuery.current.focus();
    }
  }, [todos, query, isError]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    handleSetError(ErrorMessage.NOT_ERROR);
  };

  const handleAddNewTodo = async (
    { title, completed, userId }: Omit<Todo, 'id'>,
  ) => {
    try {
      setIsDisabled(true);
      const todoToAdd = await addTodo(userId, { title, completed, userId });

      setTodos([...todos, todoToAdd]);
    } catch {
      handleSetError(ErrorMessage.ON_ADD);
    } finally {
      setIsDisabled(false);
      setTempTodo(null);
      setQuery('');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSetError(ErrorMessage.NOT_ERROR);

    if (!query.trim()) {
      handleSetError(ErrorMessage.ON_EMPTY);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    handleAddNewTodo(newTodo);
  };

  const isActiveButton = todos.every(todo => todo.completed);

  const handleToggleTodo = async (todo: Todo) => {
    handleSetError(ErrorMessage.NOT_ERROR);

    try {
      await updateTodo(USER_ID, todo.id, todo);
    } catch {
      handleSetError(ErrorMessage.ON_UPDATE);
    } finally {
      setTempUpdating([0]);
    }
  };

  const handleToggleAll = () => {
    if (isActiveButton) {
      const tempTodos = todos.map(tod => (tod.completed ? tod.id : 0));

      setTempUpdating([...tempUpdating, ...tempTodos]);
      todos.forEach(async (todo) => handleToggleTodo(
        { ...todo, completed: !todo.completed },
      ));
      const newTodos: Todo[] = todos
        .map(todo => ({ ...todo, completed: !todo.completed }));

      setTodos(newTodos);
    } else {
      const todosToUpdate = todos.filter(todo => !todo.completed);
      const tempTodos = todos.map(tod => (!tod.completed ? tod.id : 0));

      setTempUpdating([...tempUpdating, ...tempTodos]);
      todosToUpdate.forEach(async (todo) => handleToggleTodo(
        { ...todo, completed: !todo.completed },
      ));

      const newTodos: Todo[] = todos
        .map(todo => (
          {
            ...todo,
            completed: todo.completed ? todo.completed : !todo.completed,
          }));

      setTodos(newTodos);
    }
  };

  return (
    <header className="todoapp__header">
      {(!!todos.length) && (
        <button
          aria-label="toggle-all"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isActiveButton,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          disabled={isDisabled}
          ref={addTodoQuery}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
        />
      </form>
    </header>
  );
};
