import React, {
  useCallback, useEffect, useState,
} from 'react';

import { Title } from './components/Title/Title';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { Content } from './components/Content/Content';
import { Todo } from './types/Todo';
import { ErrorMessages } from './enums/ErrorMessages';
import {
  addTodo, deleteTodo, getTodos, updateStatus,
} from './api/todos';
import { Identifiers } from './enums/identifiers';
import { ErrorState } from './types/ErrorState';

const USER_ID = 11076;

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorState, setErrorState] = useState<ErrorState>(
    { message: ErrorMessages.NoError, showError: false },
  );

  const resetErrorMessage = useCallback((clearTimer = false) => {
    const timerId = localStorage.getItem(Identifiers.TimerId);

    if (timerId && clearTimer) {
      setErrorState((prevState) => ({ ...prevState, showError: false }));
      clearTimeout(+timerId);

      return localStorage.removeItem(Identifiers.TimerId);
    }

    const timer = setTimeout(() => {
      setErrorState((prevState) => ({ ...prevState, showError: false }));
    }, 3000);

    return localStorage.setItem(Identifiers.TimerId, String(timer));
  }, []);

  const createNotification = useCallback(
    (message: ErrorMessages) => {
      setErrorState({ message, showError: true });
      resetErrorMessage();
    }, [resetErrorMessage],
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await getTodos(USER_ID);

        setTodosList(res);
      } catch (e) {
        createNotification(ErrorMessages.FetchAll);
      }
    };

    fetchTodos();
  }, [createNotification]);

  const createNewTodo = useCallback(async (title: string) => {
    if (!title.trim().length) {
      createNotification(ErrorMessages.EmptyValue);

      return;
    }

    setTempTodo({
      id: 0, title, completed: false, userId: USER_ID,
    });

    const dataToServer: Omit<Todo, 'id'> = {
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      const newTodo = await addTodo(dataToServer);

      setTodosList(currentList => [...currentList, newTodo]);
      setTempTodo(null);
    } catch (e) {
      createNotification(ErrorMessages.AddError);
      setTempTodo(null);
    }
  }, [createNotification]);

  const deleteTodoById = useCallback(async (id: string) => {
    try {
      await deleteTodo(+id);

      setTodosList(list => list.filter(t => t.id !== +id));
    } catch (e) {
      createNotification(ErrorMessages.DeleteError);
    }
  }, [createNotification]);

  const deleteCompletedTodos = useCallback(async () => {
    try {
      const preparedToDelete = todosList.filter(t => t.completed)
        .map(t => deleteTodo(+t.id));

      await Promise.all(preparedToDelete);
      setTodosList(list => list.filter(t => !t.completed));
    } catch (e) {
      createNotification(ErrorMessages.DeleteError);
    }
  }, [todosList, createNotification]);

  const updateTodo = useCallback(
    async (id: number, checkStatus: Partial<Todo>) => {
      try {
        const res = await updateStatus(id, checkStatus);

        setTodosList(list => list.map(t => {
          if (t.id === id) {
            return res;
          }

          return t;
        }));
      } catch (e) {
        createNotification(ErrorMessages.UpdateError);
      }
    }, [createNotification],
  );

  const updateAllTodoCheck = useCallback(
    async (areAllCompleted: boolean) => {
      try {
        if (areAllCompleted) {
          const preparedToUpdateAll: Promise<Todo>[] = todosList.map(
            t => updateStatus(+t.id, { completed: false }) as Promise<Todo>,
          );

          const todos: Todo[] = await Promise.all(preparedToUpdateAll);

          setTodosList(todos);
        } else {
          const preparedToUpdateAll: Promise<Todo>[] = todosList.map(
            t => updateStatus(+t.id, { completed: true }) as Promise<Todo>,
          );

          const todos: Todo[] = await Promise.all(preparedToUpdateAll);

          setTodosList(todos);
        }
      } catch (e) {
        createNotification(ErrorMessages.UpdateError);
      }
    }, [createNotification, todosList],
  );

  return (
    <div className="todoapp">
      <Title />

      <Content
        todos={todosList}
        tempTodo={tempTodo}
        createNewTodo={createNewTodo}
        deleteTodo={deleteTodoById}
        deleteAllTodos={deleteCompletedTodos}
        updateTodo={updateTodo}
        updateAllTodoCheck={updateAllTodoCheck}
      />

      <ErrorNotification
        closeNotification={resetErrorMessage}
        message={errorState.message}
        showMessage={errorState.showError}
      />
    </div>
  );
};
