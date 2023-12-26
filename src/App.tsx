/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList';
import { filterTodos } from './helper';
import { Status } from './types/Status';
import { Header } from './components/Header/Header';
import { Error as ErrorTypes } from './types/Error';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';

const USER_ID = 12051;

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const deleteTodo = async (id: number) => {
    setLoadingTodosIds(prev => [...prev, id]);
    todoService.deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => showError(ErrorTypes.NotDelete))
      .finally(() => {
        setLoadingTodosIds(
          prev => prev.filter(loadingId => loadingId !== id),
        );
      });
  };

  const addTodo = (titleTodo: string): Promise<void> => {
    setTempTodo({
      title: titleTodo,
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    return todoService.addTodo({
      title: titleTodo,
      userId: USER_ID,
      completed: false,
    }).then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(() => showError(ErrorTypes.NotAdd))
      .finally(() => setTempTodo(null));
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(ErrorTypes.NotLoad));
  }, []);

  const updateTodo = ((
    id: number,
    dataUpdate: Partial<Todo>,
  ): Promise<void> => {
    setLoadingTodosIds(prev => [...prev, id]);

    return todoService.updateTodo(id, dataUpdate)
      .then((updatedTodo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage(() => ErrorTypes.NotUpdate);
        if (errorMessage) {
          showError(errorMessage);
        }
      })
      .finally(() => {
        setLoadingTodosIds((currentIds) => {
          return currentIds.filter(loadingIds => loadingIds !== id);
        });
      });
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filterStatus);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header addTodo={addTodo} showError={showError} />
        <TodoList
          deleteTodo={deleteTodo}
          todos={filteredTodos}
          tempTodo={tempTodo}
          loadingTodosIds={loadingTodosIds}
          updateTodo={updateTodo}
        />

        {todos.length > 0 && (
          <Footer
            filterStatus={filterStatus}
            filteredTodos={filteredTodos}
            setFilterStatus={setFilterStatus}
          />
        )}

      </div>
      {errorMessage && (
        <ErrorNotification errorMessage={errorMessage} />
      )}
    </div>
  );
};
