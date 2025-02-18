/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/Error/ErrorNotification';
import { clearCompleted, addTodo, completeAllTodo } from './utils/todoUtils';
import { TodoHelpers } from './types/TodoHelpers';

export enum Status {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [counterTodos, setCounterTodos] = useState(0);
  const [counterCompletedTodos, setCounterCompletedTodos] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number | number[] | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerId = useRef(0);

  const closeError = () => {
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const filteredTodos = todos.filter(todo => {
    if (status === Status.Active) {
      return !todo.completed;
    }

    if (status === Status.Completed) {
      return todo.completed;
    }

    return todo;
  });

  const helpers: TodoHelpers = {
    todos,
    setErrorMessage,
    setIsSubmitting,
    setTempTodo,
    setLoadingTodoId,
    setTodos,
    closeError,
    timerId,
    inputRef,
  };

  //#region useEffects

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }

    todoService
      .getTodos()
      .then(todosComplete => {
        setTodos(todosComplete);
        const activeTodo = todosComplete.filter(todo => !todo.completed).length;

        setCounterTodos(activeTodo);
      })
      .catch(error => {
        {
          setErrorMessage('Unable to load todos');
          window.clearTimeout(timerId.current);
          closeError();
          throw error;
        }
      });
  }, []);

  useEffect(() => {
    const activeTodos = todos.filter(todo => !todo.completed).length;
    const completedTodos = todos.filter(todo => todo.completed).length;

    setCounterTodos(activeTodos);
    setCounterCompletedTodos(completedTodos);
  }, [todos]);

  useEffect(() => {
    if (inputRef.current !== null && tempTodo === null) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  //#endregion

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          counterCompletedTodos={counterCompletedTodos}
          addTodo={addTodo}
          completeAllTodo={completeAllTodo}
          helpers={helpers}
          isSubmitting={isSubmitting}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          helpers={helpers}
          loadingTodoId={loadingTodoId}
        />

        {todos.length > 0 && (
          <Footer
            counterTodos={counterTodos}
            status={status}
            setStatus={setStatus}
            counterCompletedTodos={counterCompletedTodos}
            clearCompleted={clearCompleted}
            helpers={helpers}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
