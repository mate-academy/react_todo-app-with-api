import React, { useEffect, useRef, useState } from 'react';
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
  const [isCompleteAll, setIsCompeteAll] = useState<boolean | null>(null);

  const timerId = useRef<NodeJS.Timeout>();

  const showError = (message: string) => {
    setErrorMessage(message);
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => setErrorMessage(null), 3000);
  };

  const hideError = () => {
    setErrorMessage('');
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
      .then(data => {
        setTodos(data);
        setIsCompeteAll(data.every(item => item.completed));
      })
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

          const result = newTodos.map(todo => {
            if (todo.id === id) {
              return updatedTodo;
            }

            return todo;
          });

          return result;
        });
      })
      .catch(() => {
        showError(ErrorTypes.NotUpdate);
      })
      .finally(() => {
        setLoadingTodosIds((currentIds) => {
          return currentIds.filter(loadingIds => loadingIds !== id);
        });
      });
  });

  const toogleCompletedTodo = () => {
    todos.forEach(todo => {
      updateTodo(todo.id, { ...todo, completed: !isCompleteAll });
    });

    setIsCompeteAll(!isCompleteAll);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filterStatus);

  const clearCompleted = (data: Todo[]) => {
    data.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          showError={showError}
          toogleCompletedTodo={toogleCompletedTodo}
        />
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
            clearCompleted={clearCompleted}
          />
        )}

      </div>
      {errorMessage && (
        <ErrorNotification hideError={hideError} errorMessage={errorMessage} />
      )}
    </div>
  );
};
