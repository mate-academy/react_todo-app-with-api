import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import {
  NewTodoForm, Notification, TodoList, Filter,
} from './components';
import {
  ErrorMessage, FilterBy, Todo, TodoData,
} from './types';
import {
  addTodoWithTitle,
  deleteTodoById,
  getTodos,
  updateTodoById,
} from './api/todos';
import { countActiveTodos, getFilteredTodos } from './utils';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processedTodos, setProcessedTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);

  const visibleTodos = useMemo(
    () => getFilteredTodos(todos, filterBy),
    [todos, filterBy],
  );

  const activeTodosCount = useMemo(() => countActiveTodos(todos), [todos]);
  const hasTodos = !!todos.length;
  const hasActiveTodos = !!activeTodosCount;
  const hasCompletedTodos = !!(todos.length - activeTodosCount);
  const isFooterVisible = !!(todos.length || tempTodo);

  const clearNotification = useCallback(() => {
    setHasError(false);
  }, []);

  const clearNotificationWithDelay = useCallback(
    debounce(clearNotification, 3000),
    [],
  );

  const pushNotification = useCallback((message: ErrorMessage) => {
    setHasError(true);
    setErrorMessage(message);
    clearNotificationWithDelay();
  }, []);

  const fetchTodos = async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      pushNotification(ErrorMessage.LOAD);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddWithTitle = useCallback(async (title: string) => {
    if (!title) {
      pushNotification(ErrorMessage.TITLE);

      return;
    }

    clearNotification();
    setTempTodo({
      id: 0,
      userId: 0,
      title,
      completed: false,
    });

    try {
      await addTodoWithTitle(title);
      await fetchTodos();
    } catch {
      pushNotification(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleDelete = useCallback(async (todoToDelete: Todo) => {
    clearNotification();
    setProcessedTodos(currTodos => (
      [...currTodos, todoToDelete]
    ));

    try {
      await deleteTodoById(todoToDelete.id);
      await fetchTodos();
    } catch {
      pushNotification(ErrorMessage.DELETE);
    } finally {
      setProcessedTodos(currTodos => (
        currTodos.filter(todo => todo.id !== todoToDelete.id)
      ));
    }
  }, []);

  const handleDeleteCompleted = useCallback(async () => {
    clearNotification();
    const completedTodos = todos.filter(todo => todo.completed);

    setProcessedTodos(currTodos => [...currTodos, ...completedTodos]);

    try {
      await Promise.all(
        completedTodos.map(todo => deleteTodoById(todo.id)),
      );
      await fetchTodos();
    } catch {
      pushNotification(ErrorMessage.DELETE_ALL);
    } finally {
      setProcessedTodos(currTodos => (
        currTodos.filter(todo => !completedTodos.includes(todo))
      ));
    }
  }, [todos]);

  const handleUpdateTodo = async (
    todoToUpdate: Todo,
    fieldsToUpdate: TodoData,
  ) => {
    clearNotification();
    setProcessedTodos(prevTodos => [...prevTodos, todoToUpdate]);

    try {
      await updateTodoById(todoToUpdate.id, fieldsToUpdate);
      await fetchTodos();
    } catch {
      pushNotification(ErrorMessage.UPDATE);
    } finally {
      setProcessedTodos(currTodos => (
        currTodos.filter(todo => todo !== todoToUpdate)
      ));
    }
  };

  const handleToggleAll = async () => {
    clearNotification();

    const togglingCompleted = !hasActiveTodos;
    const todosToToggle = todos.filter(todo => (
      todo.completed === togglingCompleted
    ));

    setProcessedTodos(prevTodos => (
      [...prevTodos, ...todosToToggle]
    ));

    const updatedData: TodoData = {
      completed: !togglingCompleted,
    };

    try {
      await Promise.all(
        todosToToggle.map(todo => updateTodoById(todo.id, updatedData)),
      );
      await fetchTodos();
    } catch {
      pushNotification(ErrorMessage.UPDATE_ALL);
    } finally {
      setProcessedTodos(currTodos => (
        currTodos.filter(todo => !todosToToggle.includes(todo))
      ));
    }
  };

  const selectFilter = useCallback((filter: FilterBy) => {
    setFilterBy(filter);
  }, []);

  return (
    <div
      className={classNames(
        'todoapp',
        { 'has-error': hasError },
      )}
    >
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              aria-label="Toggle all todos"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: !hasActiveTodos },
              )}
              onClick={handleToggleAll}
            />
          )}

          <NewTodoForm onAdd={handleAddWithTitle} />
        </header>

        <section className="todoapp__main">
          <TodoList
            todos={visibleTodos}
            processedTodos={processedTodos}
            tempTodo={tempTodo}
            onDelete={handleDelete}
            onUpdate={handleUpdateTodo}
          />
        </section>

        {isFooterVisible && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodosCount} items left`}
            </span>

            <Filter selectedFilter={filterBy} onFilterSelect={selectFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!hasCompletedTodos}
              onClick={handleDeleteCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Notification
        visible={hasError}
        message={errorMessage}
        onClear={clearNotification}
      />
    </div>
  );
};
