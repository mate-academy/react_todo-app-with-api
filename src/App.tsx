/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo,
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
import { getVisibleTodos, getCompletedTodosId } from './utils/utils';
import { IdsContext } from './utils/Context/IdsContext';

const USER_ID = 10631;

export const filterOptions = ['All', 'Active', 'Completed'];
export const errorMessage = {
  forLoad: 'Unable to load todos',
  forAdd: 'Unable to add a todo',
  forTitle: 'the Title can not be empty',
  forDelete: 'Unable to delete a todo',
  forUpdate: 'Unable to update a todo',
};

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(filterOptions[0]);
  const [isError, setIsError] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorText, setErrorText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deletedIds, setDeletedIds] = useState<number[]>([0]);

  const validValue = searchValue.trim();

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todosFromServer, filter);
  }, [filter, todosFromServer]);

  const completedTodosId = getCompletedTodosId(todosFromServer);

  const changeFilter = (value: string) => setFilter(value);

  const hideNotification = () => setIsHidden(true);

  const searchHandler = (value: string) => {
    setSearchValue(value);
  };

  const errorHandler = (text: string) => {
    setIsError(true);
    setErrorText(text);
    setIsHidden(false);
  };

  const updateTodosList = (todo: Todo) => {
    setTodosFromServer((prevTodos) => [...prevTodos, todo]);
  };

  const deleteTodoFromList = (deletedId: number) => {
    setTodosFromServer(todos => todos.filter(todo => todo.id !== deletedId));
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

      addTodo(newTodo)
        .then(updateTodosList)
        .catch(() => {
          errorHandler(errorMessage.forAdd);
        })
        .finally(() => {
          setTempTodo(null);
          searchHandler('');
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
      .finally(() => setDeletedIds([0]));
  };

  const clearCompletedTodos = () => {
    setDeletedIds(completedTodosId);

    Promise.all(completedTodosId.map(id => deleteTodo(id)))
      .then(() => {
        setTodosFromServer(getVisibleTodos(todosFromServer, 'Active'));
      })
      .catch(() => {
        errorHandler(errorMessage.forDelete);
      })
      .finally(() => setDeletedIds([0]));
  };

  const updateTitle = (todoId: number, newTitle: string) => {
    setDeletedIds([todoId]);
    updateTodoTitle(todoId, newTitle)
      .then(() => {
        setTodosFromServer((prevTodos) => prevTodos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, newTitle };
          }

          return todo;
        }));
      })
      .catch(() => {
        errorHandler(errorMessage.forUpdate);
      })
      .finally(() => setDeletedIds([0]));
  };

  // setTodosFromServer((prevTodos) => prevTodos
  //   .map(todo => ({ ...todo, completed: false })));

  const updateStatus = (todoId: number, status: boolean) => {
    setDeletedIds([todoId]);
    updateTodoStatus(todoId, status)
      .then(() => {
        setTodosFromServer((prevTodos) => prevTodos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, status };
          }

          return todo;
        }));
      })
      .catch(() => {
        errorHandler(errorMessage.forUpdate);
      })
      .finally(() => setDeletedIds([0]));
  };

  const toggleAll = async () => {
    const notCompletedTodosId = getVisibleTodos(todosFromServer, 'Active')
      .map(todo => todo.id);

    // console.log(completedTodosId, 'ids');

    const isAllComplited = todosFromServer.every(todo => todo.completed);

    try {
      if (isAllComplited) {
        // console.log(deletedIds, 'deletedIds');

        Promise.all(todosFromServer
          .map(todo => updateStatus(todo.id, false)));

        setDeletedIds(completedTodosId);
        setTodosFromServer(getVisibleTodos(todosFromServer, 'Active'));
      } else {
        // console.log(deletedIds, 'deletedIds');

        Promise.all(notCompletedTodosId
          .map(id => updateStatus(id, true)));
        setDeletedIds(notCompletedTodosId);
        setTodosFromServer(getVisibleTodos(todosFromServer, 'Completed'));
      }
    } catch {
      errorHandler(errorMessage.forUpdate);
    } finally {
      // setDeletedIds([0]);
    }
  };

  // const toggleAll = () => {
  //   const notCompletedTodosId = getVisibleTodos(todosFromServer, 'Active')
  //     .map(todo => todo.id);

  //   const isAllComplited = todosFromServer.every(todo => todo.completed);

  //   if (isAllComplited) {
  //     setDeletedIds(completedTodosId);
  //     console.log(deletedIds, 'deletedIds');
  //     Promise.all(todosFromServer
  //       .map(todo => updateStatus(todo.id, false)))
  //       .then(() => {
  //         // setDeletedIds(completedTodosId);
  //         // console.log(deletedIds, 'deletedIds');
  //         setTodosFromServer(getVisibleTodos(todosFromServer, 'Active'));
  //       })
  //       .catch(() => {
  //         errorHandler(errorMessage.forUpdate);
  //       })
  //       .finally(() => setDeletedIds([0]));
  //   } else {
  //     setDeletedIds(notCompletedTodosId);
  //     console.log(deletedIds, 'deletedIds');

  //     Promise.all(notCompletedTodosId
  //       .map(id => updateStatus(id, true)))
  //       .then(() => {
  //         // setDeletedIds(notCompletedTodosId);
  //         // console.log(deletedIds, 'deletedIds');
  //         setTodosFromServer(getVisibleTodos(todosFromServer, 'Completed'));
  //       })
  //       .catch(() => {
  //         errorHandler(errorMessage.forUpdate);
  //       })
  //       .finally(() => setDeletedIds([0]));
  //   }
  // };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await getTodos(USER_ID);

        setTodosFromServer(todos);
      } catch {
        errorHandler(errorMessage.forUpdate);
      }
    };

    if (!isError) {
      loadTodos();
    }

    const errorTimer = setTimeout(() => setIsError(false), 3000);

    return () => {
      clearTimeout(errorTimer);
    };
  }, [todosFromServer]);

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
          toggleAll={toggleAll}
        />

        {todosFromServer.length > 0 && (
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
            filterOptions={filterOptions}
            todos={visibleTodos}
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
