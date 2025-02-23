import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { changeTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoFilter } from './types/TodoFilter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<TodoFilter>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [isHiddenError, setIsHiddenError] = useState(true);
  const [idsForStatusChange, setIdsForStatusChange] = useState<number[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const removeErrorMessage = () => {
    setIsHiddenError(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 1000);
  };

  const handleDelete = (id: number) => {
    setTodos(prevTodo => prevTodo.filter(todo => todo.id !== id));
  };

  const errorMessageHandler = useCallback((er: Error) => {
    setErrorMessage(er.message ?? String(er));
    setIsHiddenError(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      removeErrorMessage();
    }, 3000);
  }, []);

  const handleUpdate = (updatedTodo: Todo): Promise<void> => {
    return changeTodo(updatedTodo)
      .then(result => {
        setTodos(prevTodo =>
          prevTodo.map(todo => {
            if (updatedTodo.id === todo.id) {
              return result;
            }

            return todo;
          }),
        );
      })
      .catch((error: Error) => {
        errorMessageHandler(error);

        throw new Error('');
      });
  };

  useEffect(() => {
    getTodos()
      .then(serverTodos => {
        setTodos(serverTodos);
      })
      .catch(errorMessageHandler);
  }, []);

  const filteredTodos = () => {
    let filteredTD = todos;

    if (filterBy !== 'all') {
      filteredTD = todos.filter(todo =>
        filterBy === 'active' ? !todo.completed : todo.completed,
      );
    }

    return filteredTD;
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onError={errorMessageHandler}
          onSuccess={setTodos}
          setTempTodo={setTempTodo}
          errorMessage={errorMessage}
          setIdsForStatusChange={setIdsForStatusChange}
        />

        <TodoList
          renderedList={filteredTodos()}
          tempTodo={tempTodo}
          idsToDelete={idsToDelete}
          resetIdsToDelete={setIdsToDelete}
          onError={errorMessageHandler}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          idsForStatusChange={idsForStatusChange}
        />

        {(tempTodo || !!todos.length) && (
          <Footer
            filterBy={filterBy}
            setFilter={setFilterBy}
            todos={todos}
            onClearCompleted={setIdsToDelete}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        removeError={removeErrorMessage}
        isHiddenError={isHiddenError}
      />
    </div>
  );
};
