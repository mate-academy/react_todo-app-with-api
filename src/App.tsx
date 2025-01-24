/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServices from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingByIds, setLoadingByIds] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.ERROR_DEFAULT,
  );
  const [filterTodoBy, setFilterTodoBy] = useState<FilterType>(FilterType.ALL);

  const isAllCompletedTodo = todos.every(todo => todo.completed);
  const isVisibileBtn = todos.length > 0;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const asyncFetch = async () => {
      inputRef.current?.focus();

      try {
        const loadTodos = await todoServices.getTodos();

        setTodos(loadTodos);
      } catch (error) {
        setErrorMessage(ErrorType.ERROR_LOADING);
        throw error;
      }
    };

    asyncFetch();
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (FilterType.ACTIVE === filterTodoBy) {
        return !todo.completed;
      }

      if (FilterType.COMPLETED === filterTodoBy) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filterTodoBy]);

  const addTodo = ({ id, userId, title, completed }: Todo) => {
    setErrorMessage(ErrorType.ERROR_DEFAULT);

    const newTempTodo = { id, userId, title, completed };

    setTempTodo(newTempTodo);

    return todoServices
      .createTodo({ title, userId, completed })
      .then(newTodo => setTodos(currentTodo => [...currentTodo, newTodo]))
      .catch(error => {
        setErrorMessage(ErrorType.ERROR_ADD);

        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage(ErrorType.ERROR_DEFAULT);
    setLoadingByIds(prev => [...prev, todoId]);

    return todoServices
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        setErrorMessage(ErrorType.ERROR_DELETE);

        throw error;
      })
      .finally(() => {
        inputRef.current?.focus();
        setLoadingByIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const clearCompleted = () => {
    const completedTodoId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodoId.forEach(completedTodo => deleteTodo(completedTodo));
  };

  const updateTodoStatus = (todoToUpdate: Todo) => {
    setErrorMessage(ErrorType.ERROR_DEFAULT);
    setLoadingByIds(prev => [...prev, todoToUpdate.id]);

    const findTodo = todos.find(todo => todo.id === todoToUpdate.id) as Todo;

    const updatedTodo = { ...findTodo, completed: !findTodo.completed };

    return todoServices
      .updateTodo(updatedTodo)
      .then(newTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo => {
            if (todo.id === newTodo.id) {
              return newTodo;
            }

            return todo;
          });
        });
      })
      .catch(error => {
        setErrorMessage(ErrorType.ERROR_UPDATE);
        throw error;
      })
      .finally(() => {
        setLoadingByIds(prev => prev.filter(id => id !== todoToUpdate.id));
      });
  };

  const toggleAll = () => {
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    if (uncompletedTodos.length > 0) {
      uncompletedTodos.forEach(todo => {
        updateTodoStatus({ ...todo, completed: true });
      });
    } else {
      todos.forEach(todo => {
        updateTodoStatus({ ...todo, completed: false });
      });
    }
  };

  const updateTodoTitle = (updatedTodo: Todo) => {
    setErrorMessage(ErrorType.ERROR_DEFAULT);
    setLoadingByIds(prev => [...prev, updatedTodo.id]);

    if (updatedTodo.title.trim() === '') {
      return deleteTodo(updatedTodo.id);
    }

    return todoServices
      .updateTodo(updatedTodo)
      .then(newTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo => {
            if (todo.id === newTodo.id) {
              return newTodo;
            }

            return todo;
          });
        });
      })
      .catch(error => {
        setErrorMessage(ErrorType.ERROR_UPDATE);
        throw error;
      })
      .finally(() => {
        setLoadingByIds(prev => prev.filter(id => id !== updatedTodo.id));
      });
  };

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isVisibileBtn={isVisibileBtn}
          isAllCompletedTodo={isAllCompletedTodo}
          inputRef={inputRef}
          isLoading={!!tempTodo}
          setErrorMessage={setErrorMessage}
          onSubmit={addTodo}
          toggleAll={toggleAll}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          isLoading={!!tempTodo}
          loadingByIds={loadingByIds}
          onDelete={deleteTodo}
          updateTodo={updateTodoStatus}
          updateTodoTitle={updateTodoTitle}
          setErrorMessage={setErrorMessage}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            sortTodoBy={filterTodoBy}
            onClick={setFilterTodoBy}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessageTodo={errorMessage}
        setError={setErrorMessage}
      />
    </div>
  );
};
