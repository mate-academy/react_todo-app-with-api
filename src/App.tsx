import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import * as client from './api/todos';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { Loader } from './components/Loader';
import { isFilter, Filter, FilterType } from './types/Filter';

export const ERROR_MESSAGES = {
  failedLoadingTodos: 'Unable to load todos',
  failedAddingTodo: 'Unable to add a todo',
  failedDeletingTodo: 'Unable to delete a todo',
  failedUpdatingTodo: 'Unable to update a todo',
  emptyTitle: 'Title should not be empty',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [appliedFilter, setAppliedFilter] = useState<Filter>(FilterType.ALL);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isHiddenError, setIsHiddenError] = React.useState(true);

  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const notCompletedTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodos: Todo[] = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const addErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsHiddenError(false);
  };

  const clearErrorMessage = () => {
    setErrorMessage('');
    setIsHiddenError(true);
  };

  const updateTodoField = <T extends keyof Omit<Todo, 'id'>>(
    todoId: number,
    field: T,
    newValue: Todo[T],
  ) => {
    setTodos(prevTodos => {
      const updatedTodo = prevTodos.find(todo => todo.id === todoId);
      let index;

      if (updatedTodo) {
        index = prevTodos.indexOf(updatedTodo);

        updatedTodo[field] = newValue;

        return [
          ...prevTodos.slice(0, index),
          updatedTodo,
          ...prevTodos.slice(index + 1),
        ];
      } else {
        return prevTodos;
      }
    });
  };

  const addTodo = useCallback(async (title: string) => {
    clearErrorMessage();

    setTempTodo({
      id: 0,
      userId: client.USER_ID,
      title: title,
      completed: false,
    });

    return client
      .addTodo(title)
      .then(res => {
        setTempTodo(null);
        setTodos(prevTodos => [...prevTodos, res]);

        return res;
      })
      .catch(() => {
        setTempTodo(null);
        addErrorMessage(ERROR_MESSAGES.failedAddingTodo);

        return Promise.reject(ERROR_MESSAGES.failedAddingTodo);
      });
  }, []);

  const removeTodo = async (todoId: number) => {
    clearErrorMessage();

    return client
      .deleteTodo(todoId)
      .then(res => {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });

        return res;
      })
      .catch(() => {
        addErrorMessage(ERROR_MESSAGES.failedDeletingTodo);

        return Promise.reject(ERROR_MESSAGES.failedDeletingTodo);
      });
  };

  const changeTodoCompleteness = async (
    todoId: number,
    isCompleted: boolean,
  ) => {
    clearErrorMessage();

    return client
      .changeTodoCompleteness(todoId, isCompleted)
      .then(res => {
        updateTodoField(todoId, 'completed', isCompleted);

        return res;
      })
      .catch(() => {
        addErrorMessage(ERROR_MESSAGES.failedUpdatingTodo);

        return Promise.reject(ERROR_MESSAGES.failedUpdatingTodo);
      });
  };

  const toggleAllTodos = () => {
    const promises = [];

    if (notCompletedTodos.length === 0) {
      setUpdatingTodoIds(todos.map(todo => todo.id));

      for (const todo of todos) {
        promises.push(changeTodoCompleteness(todo.id, false));
      }
    } else {
      setUpdatingTodoIds(notCompletedTodos.map(todo => todo.id));

      for (const todo of notCompletedTodos) {
        promises.push(changeTodoCompleteness(todo.id, true));
      }
    }

    Promise.allSettled(promises).finally(() => {
      setUpdatingTodoIds([]);
    });
  };

  const clearCompletedTodos = () => {
    setUpdatingTodoIds(completedTodos.map(todo => todo.id));

    const promises = completedTodos.map(todo => removeTodo(todo.id));

    Promise.allSettled(promises).finally(() => {
      setUpdatingTodoIds([]);
    });
  };

  const renameTodo = async (todoId: number, title: string) => {
    return client
      .changeTodoTitle(todoId, title)
      .then(res => {
        updateTodoField(todoId, 'title', title);

        return res;
      })
      .catch(() => {
        addErrorMessage(ERROR_MESSAGES.failedUpdatingTodo);

        return Promise.reject(ERROR_MESSAGES.failedUpdatingTodo);
      });
  };

  const processTodoData = useCallback((promise: Promise<Todo[]>) => {
    promise
      .then(res => {
        setTodos(res);
        setTempTodo(null);
      })
      .catch(() => {
        setTempTodo(null);
        addErrorMessage(ERROR_MESSAGES.failedLoadingTodos);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    clearErrorMessage();
    setIsLoading(true);
    let filterParam = new URL(window.location.href).hash.slice(2);

    if (filterParam === '') {
      filterParam = FilterType.ALL;
    }

    if (filterParam && isFilter(filterParam)) {
      setAppliedFilter(filterParam as Filter);
    }

    clearErrorMessage();
    processTodoData(client.getTodos());
  }, [processTodoData]);

  const visibleTodos = useMemo(() => {
    switch (appliedFilter) {
      case FilterType.ACTIVE:
        return notCompletedTodos;
      case FilterType.COMPLETED:
        return completedTodos;
      default:
        return todos;
    }
  }, [todos, appliedFilter, notCompletedTodos, completedTodos]);

  if (!client.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={addErrorMessage}
          clearErrorMessage={clearErrorMessage}
          addTodo={addTodo}
          todos={todos}
          notCompletedTodos={notCompletedTodos}
          onToggleAllTodos={toggleAllTodos}
        />

        {isLoading && <Loader />}

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          className="todoapp__main"
          deleteTodo={removeTodo}
          clearErrorMessage={clearErrorMessage}
          onChangeTodoCompleteness={changeTodoCompleteness}
          updatingTodoIds={updatingTodoIds}
          onRenamingTodo={renameTodo}
        />

        {todos.length !== 0 && (
          <Footer
            clearCompletedTodos={clearCompletedTodos}
            notCompletedTodos={notCompletedTodos}
            completedTodos={completedTodos}
            appliedFilter={appliedFilter}
            handleFilterChange={setAppliedFilter}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        hidden={isHiddenError}
        hideMessage={() => setIsHiddenError(true)}
      />
    </div>
  );
};
