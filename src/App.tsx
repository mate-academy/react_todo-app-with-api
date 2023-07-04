/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodoTitle,
  updateTodoStatus,
} from './api/todos';

import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { getVisibleTodos, getTodosId } from './utils/utils';
import { IdsContext } from './utils/Context/IdsContext';
import { Options } from './types/Options';

const USER_ID = 10631;

export const errorMessage = {
  forLoad: 'Unable to load todos',
  forAdd: 'Unable to add a todo',
  forTitle: 'the Title can not be empty',
  forDelete: 'Unable to delete a todo',
  forUpdate: 'Unable to update a todo',
};

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Options.ALL);
  const [isError, setIsError] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorText, setErrorText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const validValue = searchValue.trim();

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todosFromServer, filter);
  }, [filter, todosFromServer]);

  const completedTodosId = useMemo(() => {
    return getTodosId(todosFromServer, Options.COMPLETED);
  }, [todosFromServer]);

  const notCompletedTodosId = useMemo(() => {
    return getTodosId(todosFromServer, Options.ACTIVE);
  }, [todosFromServer]);

  const changeFilter = (value: Options) => setFilter(value);

  const hideNotification = useCallback(() => {
    setIsHidden(true);
  }, []);

  const searchHandler = (value: string) => {
    setSearchValue(value);
  };

  const errorHandler = (text: string) => {
    setIsError(true);
    setErrorText(text);
    setIsHidden(false);

    setTimeout(() => setIsError(false), 3000);
  };

  const updateTodosList = (todo: Todo) => {
    setTodosFromServer((prevTodos) => [...prevTodos, todo]);
  };

  const deleteTodoFromList = (deletedId: number) => {
    setTodosFromServer(todos => todos.filter(todo => todo.id !== deletedId));
  };

  const updateAllStatuses = (newStatus: boolean) => {
    setTodosFromServer(
      prevTodos => prevTodos
        .map(todo => ({ ...todo, completed: newStatus })),
    );
  };

  const addNewTodo = (event:
  React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      userId: USER_ID,
      title: validValue,
      completed: false,
    };

    if (validValue) {
      setTempTodo({ ...newTodo, id: 0 });
      setDeletedIds([0]);

      addTodo(newTodo)
        .then(updateTodosList)
        .catch(() => {
          errorHandler(errorMessage.forAdd);
        })
        .finally(() => {
          setTempTodo(null);
          searchHandler('');
          setDeletedIds([]);
        });
    } else {
      errorHandler(errorMessage.forTitle);
      setTimeout(() => setIsError(false), 3000);
    }
  };

  const removeTodo = (todoId: number) => {
    setDeletedIds([todoId]);
    deleteTodo(todoId)
      .then(() => {
        deleteTodoFromList(todoId);
      })
      .catch(() => {
        errorHandler(errorMessage.forDelete);
      })
      .finally(() => setDeletedIds([]));
  };

  const clearCompletedTodos = () => {
    setDeletedIds(completedTodosId);

    Promise.all(completedTodosId.map(id => deleteTodo(id)))
      .then(() => {
        setTodosFromServer(getVisibleTodos(todosFromServer, Options.ACTIVE));
      })
      .catch(() => {
        errorHandler(errorMessage.forDelete);
      })
      .finally(() => setDeletedIds([]));
  };

  const updateTitle = (todoId: number, newTitle: string) => {
    setDeletedIds([todoId]);
    updateTodoTitle(todoId, newTitle)
      .then(() => {
        setTodosFromServer((prevTodos) => prevTodos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, title: newTitle };
          }

          return todo;
        }));
      })
      .catch(() => {
        errorHandler(errorMessage.forUpdate);
      })
      .finally(() => setDeletedIds([]));
  };

  const updateStatus = (todoId: number, status: boolean) => {
    setDeletedIds([todoId]);
    updateTodoStatus(todoId, status)
      .then(() => {
        setTodosFromServer((prevTodos) => prevTodos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, completed: status };
          }

          return todo;
        }));
      })
      .catch(() => {
        errorHandler(errorMessage.forUpdate);
      })
      .finally(() => setDeletedIds([]));
  };

  const toggleAllStatuses = async () => {
    const isAllComplited = todosFromServer.every(todo => todo.completed);

    try {
      if (isAllComplited) {
        setDeletedIds(completedTodosId);

        await Promise.all(todosFromServer
          .map(todo => updateTodoStatus(todo.id, false)));

        updateAllStatuses(false);
      } else {
        setDeletedIds(notCompletedTodosId);

        await Promise.all(notCompletedTodosId
          .map(id => updateTodoStatus(id, true)));

        updateAllStatuses(true);
      }
    } catch {
      errorHandler(errorMessage.forUpdate);
    } finally {
      setDeletedIds([]);
    }
  };

  const loadTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setTodosFromServer(todos);
    } catch {
      errorHandler(errorMessage.forLoad);
    }
  };

  useEffect(() => {
    if (!isError) {
      loadTodos();
    }

    const errorTimer = setTimeout(() => setIsError(false), 3000);

    return () => {
      clearTimeout(errorTimer);
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={visibleTodos}
          searchValue={searchValue}
          searchHandler={searchHandler}
          onAdd={addNewTodo}
          toggleAll={toggleAllStatuses}
        />

        {(todosFromServer.length > 0 || deletedIds.includes(0)) && (
          <IdsContext.Provider value={deletedIds}>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={removeTodo}
              updateTitle={updateTitle}
              updateStatus={updateStatus}
            />
          </IdsContext.Provider>
        )}

        {todosFromServer.length > 0 && (
          <TodoFooter
            todos={todosFromServer}
            filter={filter}
            changeFilter={changeFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      {isError && (
        <div
          className={classNames(
            'notification is-danger is-light has-text-weight-normal', {
              hidden: isHidden,
            },
          )}
        >
          <button
            type="button"
            className="delete"
            onClick={hideNotification}
          />
          {errorText}
        </div>
      )}
    </div>
  );
};
