//#region lint exception
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
//#endregion
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorMessages';
import { FilterStatus } from './types/FilterStatus';
import { getFilteredTodos } from './utils/helperFilter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.None);
  const [filter, setFilter] = useState(FilterStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedTodosIds, setProcessedTodosIds] = useState<number[]>([]);

  const handleError = useCallback((error: ErrorMessages) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(ErrorMessages.None);
    }, 3000);
  }, []);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, filter),
    [filter, todos],
  );

  useEffect(() => {
    setErrorMessage(ErrorMessages.None);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessages.Load);
      });
  }, [handleError]);

  const addTodo = useCallback(
    async (title: string) => {
      const newTitle = title.trim();

      if (!newTitle) {
        handleError(ErrorMessages.Title);

        return;
      }

      const todoToAdd = {
        userId: todoService.USER_ID,
        title: newTitle,
        completed: false,
      };

      setTempTodo({ id: 0, ...todoToAdd });

      try {
        const newTodo = await todoService.postTodo(todoToAdd);

        setTodos(prevTodos => [...prevTodos, newTodo]);
      } catch (error) {
        handleError(ErrorMessages.Add);

        throw error;
      } finally {
        setTempTodo(null);
      }
    },
    [handleError],
  );

  const deleteTodo = useCallback(
    (todoId: number) => {
      setProcessedTodosIds(prevIds => [...prevIds, todoId]);

      return todoService
        .deleteTodo(todoId)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== todoId),
          );
        })
        .catch(() => handleError(ErrorMessages.Delete))
        .finally(() => setProcessedTodosIds([]));
    },
    [handleError],
  );

  const updateTodo = useCallback(
    async (id: number, todoData: Partial<Todo>) => {
      setProcessedTodosIds(prevIds => [...prevIds, id]);

      try {
        const updatedTodo = await todoService.patchTodo(id, todoData);

        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === id ? updatedTodo : currentTodo,
          ),
        );
      } catch (error) {
        handleError(ErrorMessages.Update);
        throw error;
      } finally {
        setProcessedTodosIds([]);
      }
    },
    [handleError],
  );

  return (
    <>
      {USER_ID ? (
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header todos={todos} onAdd={addTodo} onUpdate={updateTodo} />

            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              processedTodosIds={processedTodosIds}
            />

            {!!todos.length && (
              <Footer
                todos={todos}
                filter={filter}
                onFilter={setFilter}
                onDelete={deleteTodo}
              />
            )}
          </div>

          <ErrorNotification
            errorMessage={errorMessage}
            onErrorMessage={setErrorMessage}
          />
        </div>
      ) : (
        <UserWarning />
      )}
    </>
  );
};
