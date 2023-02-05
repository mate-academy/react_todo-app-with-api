import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import {
  Footer, Header, Notification, TodoList,
} from './components';
import { ErrorMessage, FilterBy, Todo } from './types';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
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
  const hasActiveTodos = !!activeTodosCount;
  const hasCompletedTodos = !!(todos.length - activeTodosCount);
  const isFooterVisible = !!(todos.length || tempTodo);

  const creating = useMemo(() => !!tempTodo, [tempTodo]);

  const pushNotification = useCallback((message: ErrorMessage) => {
    setHasError(true);
    setErrorMessage(message);
  }, []);

  const clearNotification = useCallback(() => {
    setHasError(false);
  }, []);

  useEffect(() => {
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        pushNotification(ErrorMessage.LOAD);
      });
  }, []);

  const handleAdd = useCallback((todoToAdd: Todo) => {
    clearNotification();
    setTempTodo(todoToAdd);

    addTodo(todoToAdd)
      .then((todo) => {
        setTodos((prevTodos) => [...prevTodos, todo]);
      })
      .catch(() => {
        pushNotification(ErrorMessage.LOAD);
      })
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const handleDelete = useCallback((todoToDelete: Todo) => {
    clearNotification();
    setProcessedTodos(prevTodos => (
      [...prevTodos, todoToDelete]
    ));

    deleteTodo(todoToDelete.id)
      .then(() => {
        setTodos(prevTodos => (
          prevTodos.filter(todo => todo.id !== todoToDelete.id)
        ));
      })
      .catch(() => {
        pushNotification(ErrorMessage.DELETE);
      })
      .finally(() => {
        setProcessedTodos(prevTodos => (
          prevTodos.filter(todo => todo.id !== todoToDelete.id)
        ));
      });
  }, []);

  const handleDeleteCompleted = useCallback(() => {
    clearNotification();
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDelete(todo));
  }, [todos]);

  const handleUpdateTodo = (
    todoToUpdate: Todo,
    fieldsToUpdate: Partial<Todo>,
  ) => {
    clearNotification();
    setProcessedTodos(prevTodos => [...prevTodos, todoToUpdate]);

    updateTodo(todoToUpdate.id, fieldsToUpdate)
      .then(updatedTodo => {
        setTodos(prevTodos => (
          prevTodos.map(todo => (
            todo === todoToUpdate
              ? updatedTodo
              : todo
          ))
        ));
      })
      .catch(() => pushNotification(ErrorMessage.UPDATE))
      .finally(() => {
        setProcessedTodos(prev => (
          prev.filter(todo => todo !== todoToUpdate)
        ));
      });
  };

  const handleStatusToggle = (todo: Todo) => {
    const updatedFields = {
      completed: !todo.completed,
    };

    handleUpdateTodo(todo, updatedFields);
  };

  const handleToggleAll = (completed: boolean) => {
    clearNotification();

    const todosToToggle = todos.filter(todo => todo.completed === completed);

    setProcessedTodos(prevTodos => (
      [...prevTodos, ...todosToToggle]
    ));

    todosToToggle.forEach(todo => handleStatusToggle(todo));
  };

  return (
    <div
      className={classNames(
        'todoapp',
        { 'has-error': hasError },
      )}
    >
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={handleAdd}
          onToggleAll={handleToggleAll}
          onError={pushNotification}
          hasActive={hasActiveTodos}
          creating={creating}
        />

        <TodoList
          todos={visibleTodos}
          processedTodos={processedTodos}
          tempTodo={tempTodo}
          onDelete={handleDelete}
          onUpdate={handleUpdateTodo}
        />

        {isFooterVisible && (
          <Footer
            activeTodosCount={activeTodosCount}
            filterType={filterBy}
            setFilter={setFilterBy}
            isClearButtonVisible={hasCompletedTodos}
            onDeleteCompleted={handleDeleteCompleted}
          />
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
