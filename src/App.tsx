import React, { useEffect, useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { NewTodo, NewTodoRef } from './components/NewTodo';

const USER_ID = 632;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const newTodoRef = useRef<NewTodoRef>(null);

  const focusInput = () => {
    newTodoRef.current?.focus();
  };

  useEffect(() => {
    setErrorMessage(ErrorMessage.None);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        case FilterStatus.All:
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const isAllCompleted = useMemo(() => {
    return todos.length > 0 && todos.every(todo => todo.completed);
  }, [todos]);

  const handleAddTodo = async (title: string) => {
    setErrorMessage(ErrorMessage.None);
    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const newTodo = await createTodo(title, USER_ID);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      setErrorMessage(ErrorMessage.Add);
      throw new Error();
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      focusInput();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setErrorMessage(ErrorMessage.None);
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
      focusInput();
    }
  };

  const handleUpdateTodo = async (id: number, data: Partial<Todo>) => {
    setErrorMessage(ErrorMessage.None);
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      const updated = await updateTodo(id, data);

      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      setErrorMessage(ErrorMessage.Update);
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleToggleAll = async () => {
    setErrorMessage(ErrorMessage.None);
    const targetStatus = !isAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    const updateIds = todosToUpdate.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...updateIds]);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: targetStatus }),
      ),
    );

    let hasError = false;

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const updated = result.value;

        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      } else {
        hasError = true;
      }
    });

    if (hasError) {
      setErrorMessage(ErrorMessage.Update);
    }

    setLoadingTodoIds(prev => prev.filter(id => !updateIds.includes(id)));
  };

  const handleClearCompleted = async () => {
    setErrorMessage(ErrorMessage.None);
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfullyDeletedIds: number[] = [];
    let hasError = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfullyDeletedIds.push(completedIds[index]);
      } else {
        hasError = true;
      }
    });

    setTodos(prev =>
      prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    if (hasError) {
      setErrorMessage(ErrorMessage.Delete);
    }

    setLoadingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));

    focusInput();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <NewTodo
            ref={newTodoRef}
            onSubmit={handleAddTodo}
            isSubmitting={isAdding}
            onError={msg => setErrorMessage(msg as ErrorMessage)}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount} items left
              </span>

              <Filter filter={filter} onFilterChange={setFilter} />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompleted}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessage.None)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
