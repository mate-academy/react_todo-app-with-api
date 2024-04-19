import { useContext, useEffect, useMemo, useRef } from 'react';
import { TodosContext } from '../todosContext';
import { ErrorStatus } from '../../types/ErrorStatus';
import cn from 'classnames';
// import { updateTodo } from '../../api/todos';

export const Header: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    addTodo,
    setErrorMessage,
    isSubmit,
    setLoadingIds,
    title,
    setTitle,
    setTempTodo,
    todos,
    handleUpdateTodo,
  } = useContext(TodosContext);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      setErrorMessage(ErrorStatus.ErrorTitle);
      setTimeout(() => setErrorMessage(ErrorStatus.NoError), 3000);

      return;
    }

    const newTodo = {
      id: 0,
      userId: 422,
      title: normalizeTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    addTodo(newTodo);
    setLoadingIds([]);
  };

  const isAllCompleted = useMemo(() => {
    if (todos.length) {
      return todos.every(todo => todo.completed);
    } else {
      return false;
    }
  }, [todos]);

  const handleToggleAllButton = () => {
    if (isAllCompleted) {
      const todosUpdated = todos.map(item => ({
        ...item,
        completed: !isAllCompleted,
      }));

      todosUpdated.forEach(t => handleUpdateTodo(t));
    } else {
      const todosToUpate = todos
        .filter(item => !item.completed)
        .map(item => ({
          ...item,
          completed: !isAllCompleted,
        }));

      todosToUpate.forEach(t => handleUpdateTodo(t));
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllButton}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(event.target.value);
          }}
          disabled={isSubmit}
        />
      </form>
    </header>
  );
};
