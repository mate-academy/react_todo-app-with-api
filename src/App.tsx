import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { deleteTodo, getTodos, patchTodo } from './api/todos';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';

import { handleError } from './utils/handleError';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [filterOption, setFilterOption] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletionIds, setDeletionIds] = useState<number[]>([]);
  const [pendingTodos, setPendingTodos] = useState<Todo[]>([]);

  const completedTodoIds = useMemo(() => {
    return todosFromServer.filter(todo => todo.completed).map(todo => todo.id);
  }, [todosFromServer]);

  const uncompletedTodos = useMemo(() => {
    return todosFromServer.filter(todo => !todo.completed);
  }, [todosFromServer]);

  const uncompletedTodosAmount = uncompletedTodos.length;

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todosFromServer, filterOption);
  }, [todosFromServer, filterOption]);

  const handleDeleteTodos = useCallback((ids: number[]) => {
    Promise.all(
      ids.map(id => {
        setDeletionIds(current => [...current, id]);

        deleteTodo(id)
          .then(() => {
            setTodosFromServer(current =>
              current.filter(todo => todo.id !== id),
            );
          })
          .catch(() => {
            handleError(setErrorMessage, Errors.DeleteTodo);
          })
          .finally(() =>
            setDeletionIds(currIds => currIds.filter(currId => currId !== id)),
          );
      }),
    );
  }, []);

  const handleChangeTodos = useCallback(
    (newTodos: Todo[]) => {
      return Promise.all(
        newTodos.map(todo => {
          setPendingTodos(current => [...current, todo]);

          const { id, ...todoBody } = todo;

          return patchTodo(todoBody, id)
            .then(() => {
              setTodosFromServer(current =>
                current.map(currentTodo => {
                  return currentTodo.id !== todo.id ? currentTodo : todo;
                }),
              );
            })
            .catch(() => {
              handleError(setErrorMessage, Errors.UpdateTodo);
              throw new Error(errorMessage);
            })
            .finally(() => setPendingTodos([]));
        }),
      );
    },
    [errorMessage],
  );

  const handleToggleCompleted = (id: number, updatedField: Partial<Todo>) => {
    setPendingTodos(current => [...current]);

    return patchTodo(updatedField, id)
      .then((updatedTodo: Todo) =>
        setTodosFromServer(current =>
          current.map(todo => (todo.id === id ? updatedTodo : todo)),
        ),
      )
      .catch(() => {
        handleError(setErrorMessage, Errors.UpdateTodo);
        throw new Error(errorMessage);
      })
      .finally(() =>
        setPendingTodos(current => current.filter(todo => todo.id !== id)),
      );
  };

  const handleToggleCompletedAll = () => {
    if (uncompletedTodos && uncompletedTodosAmount) {
      Promise.allSettled(
        uncompletedTodos.map(({ id }) =>
          handleToggleCompleted(id, { completed: true }),
        ),
      );
    } else {
      Promise.allSettled(
        todosFromServer.map(({ id }) =>
          handleToggleCompleted(id, { completed: false }),
        ),
      );
    }
  };

  useEffect(() => {
    getTodos()
      .then(setTodosFromServer)
      .catch(() => handleError(setErrorMessage, Errors.LoadingTodos));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodos={setTodosFromServer}
          setError={setErrorMessage}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          uncompletedTodosAmount={uncompletedTodosAmount}
          todos={todosFromServer}
          onToggleCompletedAll={handleToggleCompletedAll}
        />

        {!!todosFromServer.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deletionIds={deletionIds}
              pendingTodos={pendingTodos}
              errorMessage={errorMessage}
              onTodosChange={handleChangeTodos}
              onDeleteTodos={handleDeleteTodos}
            />
            <Footer
              filterOption={filterOption}
              completedTodoIds={completedTodoIds}
              uncompletedTodosAmount={uncompletedTodosAmount}
              setFilterOption={setFilterOption}
              setDeletionIds={setDeletionIds}
              onDeleteTodos={handleDeleteTodos}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
