/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
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
import { ErrorMessages } from './types/ErrorMessages';
import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isBeingAdded, setIsBeingAdded] = useState(false);

  const showError = (message: ErrorMessages) => {
    setHasError(true);
    setErrorMessage(message);
  };

  const clearNotification = useCallback(() => {
    setHasError(false);
  }, []);

  useEffect(() => {
    getTodos()
      .then(fetchTodos => {
        setTodos(fetchTodos);
      })
      .catch(() => {
        showError(ErrorMessages.ONLOAD);
      });
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.ALL:
        return true;

      case FilterBy.ACTIVE:
        return !todo.completed;

      case FilterBy.COMPLETED:
        return todo.completed;

      default:
        throw new Error('error!');
    }
  });

  const countActiveTodos = todos.filter(todo => !todo.completed).length;
  const isFooterVisible = !!todos.length;
  const hasCompletedTodos = !!todos.filter(todo => todo.completed).length;
  const hasActiveTodos = !!countActiveTodos;

  const handleAddTodo = useCallback((title: string) => {
    clearNotification();

    if (!title.trim()) {
      showError(ErrorMessages.ONTITLE);
      setTodoTitle('');

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
    };

    setTempTodo(todoToAdd);
    setIsBeingAdded(true);

    addTodo(todoToAdd)
      .then(todo => {
        setTodos(curTodos => [...curTodos, todo]);
        setTodoTitle('');
      })
      .catch(() => {
        showError(ErrorMessages.ONADD);
      })
      .finally(() => {
        setTempTodo(null);
        setIsBeingAdded(false);
      });
  }, []);

  const handleDeleteTodo = useCallback((todoId: number) => {
    clearNotification();

    deleteTodo(todoId)
      .then(() => {
        setTodos(curTodos => (
          curTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        showError(ErrorMessages.ONDELETE);
      });
  }, []);

  const handleDeleteCompletedTodos = useCallback(() => {
    clearNotification();

    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  }, [todos]);

  const handleUpdateTodo = (
    todoToUpdate: Todo,
    propsToUpdate: Partial<Todo>,
  ) => {
    clearNotification();

    updateTodo(todoToUpdate.id, propsToUpdate)
      .then(updatedTodo => {
        setTodos(curTodos => {
          return curTodos.map(todo => (
            todo === todoToUpdate
              ? updatedTodo
              : todo
          ));
        });
      })
      .catch(() => showError(ErrorMessages.ONUPDATE));
  };

  const handleStatusOfTodo = (todo: Todo) => {
    const props = {
      completed: !todo.completed,
    };

    handleUpdateTodo(todo, props);
  };

  const handleStatusOfAllTodos = (completed: boolean) => {
    clearNotification();

    const todosToChangeStatus = todos
      .filter(todo => todo.completed === completed);

    todosToChangeStatus.forEach(todo => handleStatusOfTodo(todo));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isBeingAdded={isBeingAdded}
          onStatusAll={handleStatusOfAllTodos}
          hasActive={hasActiveTodos}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          isBeingAdded={isBeingAdded}
          onRemove={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
        />

        { isFooterVisible && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            countActiveTodos={countActiveTodos}
            isClearButtonVisible={hasCompletedTodos}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <Notification
        hasError={hasError}
        errorMessage={errorMessage}
        onClear={clearNotification}
      />
    </div>
  );
};
