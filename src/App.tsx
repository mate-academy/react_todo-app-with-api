/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  createTodo,
  getTodos,
  removeTodo,
  update,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { ActionStateContext } from './context/ActionStateContext';
import { ErrorMessage } from './enums/ErrorMessage';
import { Filter } from './enums/Filter';
import {
  addIfNotInArr,
  countUnfinished,
  normalizeTodos,
} from './helpers/helpers';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterStatus, setFilterStatus] = (useState(Filter.ALL));
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedIdArr, setSelectedIdArr] = useState<number[]>([]);

  const loadTodos = async (userID: number) => {
    setIsLoading(true);
    try {
      const serverTodos = await getTodos(userID);
      const normalizedTodos = normalizeTodos(serverTodos);

      setUserTodos(normalizedTodos);
    } catch {
      setErrorMessage(ErrorMessage.LOAD);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTodos(user.id);
    }
  }, [user]);

  const addTodo = async (todoTitle: string) => {
    if (!user) {
      return;
    }

    try {
      setIsAdding(true);
      const temp = {
        id: 0,
        completed: false,
        userId: user?.id,
        title: todoTitle,
      };

      setTempTodo(temp);
      const newTodo = await createTodo(temp);

      setUserTodos(current => {
        const {
          id,
          userId,
          title,
          completed,
        } = newTodo;

        return [
          ...current,
          {
            id,
            userId,
            title,
            completed,
          },
        ];
      });
    } catch {
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const updateTodo = async (id: number, data: Partial<Todo>) => {
    setSelectedIdArr(current => addIfNotInArr(current, id));

    try {
      setIsUpdating(true);
      await update(id, data);
      setUserTodos(current => current.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            ...data,
          };
        }

        return todo;
      }));
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setSelectedIdArr([]);

      setIsUpdating(false);
    }
  };

  const deleteTodo = async (id: number) => {
    setSelectedIdArr(current => addIfNotInArr(current, id));
    try {
      setIsDeleting(true);

      await removeTodo(id);
      setUserTodos(current => (
        current.filter(todo => todo.id !== id)
      ));
    } catch {
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setSelectedIdArr([]);
      setIsDeleting(false);
    }
  };

  const getVisibleTodos = () => {
    switch (filterStatus) {
      case Filter.ACTIVE:
        return userTodos.filter((todo) => !todo.completed);
      case Filter.COMPLETED:
        return userTodos.filter((todo) => todo.completed);
      default:
        return userTodos;
    }
  };

  const toggleAllTodos = useCallback(() => {
    const toggleValue = userTodos.every(todo => todo.completed);

    userTodos.forEach(todo => {
      updateTodo(todo.id, { completed: !toggleValue });
    });
  }, [userTodos, selectedIdArr]);

  const clearCompleted = useCallback(() => {
    const finishedTodos = userTodos.filter(todo => todo.completed);

    if (finishedTodos.length > 0) {
      finishedTodos.forEach(todo => deleteTodo(todo.id));
    }
  }, [userTodos]);

  const clearError = useCallback(() => setErrorMessage(null), []);

  const visibleTodos = useMemo(getVisibleTodos, [filterStatus, userTodos]);

  const unfinishedTodosLeft = useMemo(
    () => countUnfinished(userTodos), [userTodos],
  );

  const isSomeFinished = useMemo(() => {
    return userTodos.some(todo => todo.completed);
  }, [userTodos]);

  const isAllFinished = useMemo(() => {
    return userTodos.every(todo => todo.completed);
  }, [userTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          isAllFinished={isAllFinished}
          setError={setErrorMessage}
          isAdding={isAdding}
          addTodo={addTodo}
          toggleAllTodos={toggleAllTodos}
        />

        {isLoading && (
          <Loader />
        )}

        {!!userTodos.length && (
          <>
            <ActionStateContext.Provider value={
              {
                isDeleting,
                isUpdating,
                selectedIdArr,
              }
            }
            >
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                deleteTodo={deleteTodo}
                updateTodo={updateTodo}
              />
            </ActionStateContext.Provider>
            <Footer
              unfinishedTodosLeft={unfinishedTodosLeft}
              activeFilter={filterStatus}
              setFilter={setFilterStatus}
              isSomeFinished={isSomeFinished}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      {!!errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          clearError={clearError}
        />
      )}
    </div>
  );
};
