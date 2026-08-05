import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo, TodoUpdate } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoFilter, TodoStatus } from './components/TodoFilter';
import { NewTodoForm } from './components/NewTodoForm';

const ERROR_HIDE_DELAY = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedTodoIds, setProcessedTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const errorTimerId = useRef<number | null>(null);
  const newTodoField = useRef<HTMLInputElement>(null);

  const hideError = useCallback(() => setErrorMessage(''), []);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    if (errorTimerId.current) {
      window.clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, ERROR_HIDE_DELAY);
  }, []);

  const startProcessing = (todoId: number) => {
    setProcessedTodoIds(currentIds => [...currentIds, todoId]);
  };

  const stopProcessing = (todoId: number) => {
    setProcessedTodoIds(currentIds =>
      currentIds.filter(processedId => processedId !== todoId),
    );
  };

  useEffect(() => {
    hideError();

    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));

    return () => {
      if (errorTimerId.current) {
        window.clearTimeout(errorTimerId.current);
      }
    };
  }, [hideError, showError]);

  const visibleTodos = useMemo(() => {
    if (status === TodoStatus.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (status === TodoStatus.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, status]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    hideError();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      showError('Title should not be empty');
      newTodoField.current?.focus();

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });

    try {
      const createdTodo = await createTodo(normalizedTitle);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      window.setTimeout(() => newTodoField.current?.focus());
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    hideError();
    startProcessing(todoId);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      showError('Unable to delete a todo');

      return false;
    } finally {
      stopProcessing(todoId);
      window.setTimeout(() => newTodoField.current?.focus());
    }
  };

  const handleUpdateTodo = async (todoId: number, data: TodoUpdate) => {
    hideError();
    startProcessing(todoId);

    try {
      const updatedTodo = await updateTodo(todoId, data);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );

      return true;
    } catch {
      showError('Unable to update a todo');

      return false;
    } finally {
      stopProcessing(todoId);
    }
  };

  const handleClearCompleted = async () => {
    hideError();

    await Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo => handleDeleteTodo(todo.id)),
    );
  };

  const handleToggleAll = async () => {
    const completed = !todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed !== completed);

    await Promise.all(
      todosToUpdate.map(todo => handleUpdateTodo(todo.id, { completed })),
    );
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <NewTodoForm
            title={title}
            isCreating={tempTodo !== null}
            fieldRef={newTodoField}
            onTitleChange={setTitle}
            onSubmit={handleAddTodo}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processedTodoIds={processedTodoIds}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <TodoFilter status={status} onStatusChange={setStatus} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
