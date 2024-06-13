/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  editTodo,
  getTodos,
  toggleTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorsTypes } from './types/ErrorsType';
import { TodoList } from './components/TodoList';
import { TodoFilterPanel } from './components/TodofilterPanel';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverError, setServerError] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);
  const activeTodo = todos.filter((todo: Todo) => !todo.completed);
  const todoCompleted = todos.filter((todo: Todo) => todo.completed);
  const allCompletedTodo = todos.every((todo: Todo) => todo.completed);
  const someCompleted = todos.some((todo: Todo) => todo.completed);

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorsTypes.UnableToLoadTodos))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (titleField.current) {
      return titleField.current.focus();
    }
  }, [isSubmiting]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  function onToggleTodo(
    id: number,
    updatedFields: Partial<Todo>,
  ): Promise<void> {
    return toggleTodo(id, updatedFields)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo => {
            if (currentTodo.id === id) {
              return { ...currentTodo, ...updatedFields };
            }

            return currentTodo;
          }),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorsTypes.UnabelToUpdate);
        throw error;
      });
  }

  const handleToggleTodo = (id: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, id]);
    const needToUpdate = todos.find(todo => todo.id === id);
    const updatedFields = { completed: !needToUpdate?.completed };

    onToggleTodo(id, updatedFields).finally(() => setLoadingTodoIds([]));
  };

  const toggleAllTodos = async () => {
    const completedTodosId = todos.map(todo => todo.id);

    if (someCompleted && !allCompletedTodo) {
      const filteredTodosId = activeTodo.map(todo => todo.id);

      await filteredTodosId.forEach(id => handleToggleTodo(id));
    } else {
      await completedTodosId.forEach(id => handleToggleTodo(id));
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorsTypes.EmptyTitle);

      return;
    }

    setIsSubmiting(true);
    setErrorMessage('');

    setTempTodo({
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    });

    if (tempTodo) {
      setTodos(prevTodos => [...prevTodos, tempTodo]);
    }

    return addTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(newTodo => {
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== tempTodo?.id),
        );
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(error => {
        setTodos(todos);
        setTempTodo(null);
        setErrorMessage(ErrorsTypes.UnabelToAdd);
        throw error;
      })
      .finally(() => setIsSubmiting(false));
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsSubmiting(true);
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorsTypes.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setIsSubmiting(false);
        setLoadingTodoIds([]);
      });
  };

  const handleUpdatedTodo = (currentTodo: Todo) => {
    setIsSubmiting(true);
    setErrorMessage('');
    setLoadingTodoIds(prevIds => [...prevIds, currentTodo.id]);

    return editTodo(currentTodo.id, currentTodo.title.trim())
      .then(editedTodo => {
        setTodos(prevTodo =>
          prevTodo.map(todo => (todo.id === editedTodo.id ? editedTodo : todo)),
        );

        setServerError(false);
      })
      .catch(error => {
        setTodos(todos);
        setErrorMessage(ErrorsTypes.UnabelToUpdate);
        setServerError(true);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prevIds =>
          prevIds.filter(id => id !== currentTodo.id),
        );
        setIsSubmiting(false);
      });
  };

  const clearAllCopleted = async () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    await completedTodosIds.forEach(id => handleDeleteTodo(id));
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage('');
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filterTodos = useCallback(
    (currentTodos: Todo[], currentFilter: Filter) => {
      if (currentFilter === Filter.Active) {
        return currentTodos.filter((todo: Todo) => !todo.completed);
      } else if (currentFilter === Filter.Completed) {
        return currentTodos.filter((todo: Todo) => todo.completed);
      } else {
        return currentTodos;
      }
    },
    [],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [filterTodos, todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAllTodos}
            />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              onChange={handleTitleChange}
              ref={titleField}
              value={title}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isSubmiting}
            />
          </form>
        </header>

        {!loading && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              handleToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              onEditTodo={handleUpdatedTodo}
              loadingTodoIds={loadingTodoIds}
              serverError={serverError}
            />
            {tempTodo !== null && (
              <TodoItem todo={tempTodo} handleToggleTodo={handleToggleTodo} />
            )}
          </>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodo.length} items left
            </span>

            <TodoFilterPanel
              filter={filter}
              onFilterChange={handleFilterChange}
            />
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todoCompleted.length === 0}
              onClick={clearAllCopleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseErrorMessage}
        />
        {errorMessage}
      </div>
    </div>
  );
};
