/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterBy } from './types/Filter';
import { Todo } from './types/Todo';
import { getFiltredTodos } from './utils/getFiltredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isBeingLoading, setIsBeingLoading] = useState(false);

  const showError = (message: ErrorMessage) => {
    setHasError(true);
    setErrorMessage(message);
  };

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos(USER_ID);

      setTodos(loadedTodos);
    } catch {
      setHasError(true);
      setErrorMessage(ErrorMessage.ONLOAD);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => (
    getFiltredTodos(todos, filterBy)
  ), [todos, filterBy]);

  const activeTodosAmount = todos.filter(todo => !todo.completed).length;
  const isFooterVisible = !!todos.length;
  const isClearButtonVisible = !!(todos.length - activeTodosAmount);

  const clearNotification = useCallback(() => {
    setHasError(false);
  }, []);

  const setIsLoading = useCallback((todoId: number) => {
    setTodos(todosItems => {
      return todosItems.map(item => {
        if (item.id === todoId) {
          return {
            ...item,
            isLoading: true,
          };
        }

        return item;
      });
    });
  }, []);

  const handleAddTodo = useCallback(async (title: string) => {
    clearNotification();

    if (!title.trim()) {
      showError(ErrorMessage.ONTITLE);
      setTodoTitle('');

      return;
    }

    const todoToAdd: Todo = {
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
      isLoading: true,
    };

    setTempTodo(todoToAdd);

    try {
      const todoAdder = await addTodo(USER_ID, todoToAdd);

      setTodos(curTodos => [...curTodos, todoAdder]);
      setTodoTitle('');
    } catch {
      showError(ErrorMessage.ONADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    clearNotification();
    try {
      setIsLoading(todoId);
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      showError(ErrorMessage.ONDELETE);
    }
  }, []);

  const handleDeleteCompletedTodos = useCallback(async () => {
    setIsBeingLoading(true);
    const tasks = todos.map(async todo => {
      if (todo.completed) {
        await handleDeleteTodo(todo.id);
      }
    });

    await Promise.all(tasks);
    setIsBeingLoading(false);
  }, [todos]);
  const handleUpdateTodo = async (
    todoToUpdate: Todo,
    propsToUpdate: Partial<Todo>,
  ) => {
    clearNotification();
    try {
      setIsLoading(todoToUpdate.id);
      const updatedTodo = await updateTodo(todoToUpdate.id, propsToUpdate);

      setTodos(curTodos => {
        return curTodos.map(todo => (
          todo.id === todoToUpdate.id
            ? updatedTodo
            : todo
        )).map(todo => ({
          ...todo, isLoading: false,
        }));
      });
    } catch {
      showError(ErrorMessage.ONUPDATE);
    }
  };

  const handleStatusOfAllTodos = () => {
    clearNotification();
    const activeTodos = getFiltredTodos(todos, FilterBy.ACTIVE);

    if (activeTodos.length > 0) {
      activeTodos.forEach(
        todo => handleUpdateTodo(todo, { completed: true }),
      );

      return;
    }

    todos.forEach(
      todo => handleUpdateTodo(todo, { completed: false }),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isBeingLoading={isBeingLoading}
          showExpendIcon={todos.length > 0}
          onStatusAll={handleStatusOfAllTodos}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onRemove={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
        />

        {isFooterVisible && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            activeTodosAmount={activeTodosAmount}
            isClearButtonVisible={isClearButtonVisible}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      {hasError && (
        <Notification
          hasError={hasError}
          errorMessage={errorMessage}
          onClear={clearNotification}
        />
      )}
    </div>
  );
};
