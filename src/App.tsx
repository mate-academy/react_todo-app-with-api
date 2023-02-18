import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import {
  Footer, Header, Notification, TodoList,
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
  const isCreating = !!tempTodo;

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

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        pushNotification(ErrorMessage.LOAD);
      }
    };

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
      const addedTodo = await addTodoWithTitle(title);

      setTodos((currTodos) => [...currTodos, addedTodo]);
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

      setTodos(currTodos => (
        currTodos.filter(todo => todo.id !== todoToDelete.id)
      ));
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

      setTodos(currTodos => (
        currTodos.filter(todo => !completedTodos.includes(todo))
      ));
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
      const updatedTodo = await updateTodoById(todoToUpdate.id, fieldsToUpdate);

      setTodos(currTodos => (
        currTodos.map(todo => (
          todo.id === todoToUpdate.id
            ? updatedTodo
            : todo
        ))
      ));
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
      const updatedTodos = await Promise.all(
        todosToToggle.map(todo => updateTodoById(todo.id, updatedData)),
      );

      setTodos(currTodos => (
        currTodos.map(todo => {
          const updatedTodo = updatedTodos.find(t => t.id === todo.id) || null;

          if (updatedTodo) {
            return updatedTodo;
          }

          return todo;
        })
      ));
    } catch {
      pushNotification(ErrorMessage.UPDATE_ALL);
    } finally {
      setProcessedTodos(currTodos => (
        currTodos.filter(todo => !todosToToggle.includes(todo))
      ));
    }
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
          onAdd={handleAddWithTitle}
          onToggleAll={handleToggleAll}
          hasActive={hasActiveTodos}
          isCreating={isCreating}
          isToggleButtonVisible={hasTodos}
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
