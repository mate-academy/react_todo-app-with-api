/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {
  deleteTodo,
  editingTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppMain } from './components/TodoAppMain';
import { TodoMainFooter } from './components/TodoMainFooter';
import classNames from 'classnames';
import { FilterOptions } from './components/TodoMainFooter/TodoMainFooter';
import { EditTodo, Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [notificationError, setNotificationError] = useState(false);

  const [errorTodos, setErrorTodos] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorPostTodo, setErrorPostTodo] = useState(false);
  const [loadingPostTodo, setLoadingPostTodo] = useState(false);

  const [filterTodos, setFilterTodos] = useState<FilterOptions>('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [counter, setCounter] = useState(0);

  const [titleTodo, setTitleTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loaderDelete, setLoaderDelete] = useState(false);
  const [selectedDeleteTodo, setSelectedDeleteTodo] = useState<number | null>(
    null,
  );

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const [deleteError, setDeleteError] = useState(false);
  const [clearButton, setClearButton] = useState(false);
  const [loaderDeleteCompleted, setLoaderDeleteCompleted] = useState(false);

  const [toggleTodo, setToggleTodo] = useState<Todo | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  const [loaderToggle, setLoaderToggle] = useState(false);
  const [toggleError, setToggleError] = useState(false);
  const [isClickToggleAllButton, setsIClickToggleAllButton] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editTodo, setEditTodo] = useState<EditTodo | null>(null);
  const [selectedUpdateTodo, setSelectedUpdateTodo] = useState<number | null>(
    null,
  );

  const includesFalseCompleted = todos.every(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filterTodos === 'active') {
      return todo.completed === false;
    }

    if (filterTodos === 'completed') {
      return todo.completed;
    }

    return todos;
  });

  function loadTodos() {
    getTodos()
      .then(serverTodos => {
        setTodos(serverTodos);
        setCounter(serverTodos.length);
      })
      .catch(() => {
        setErrorTodos(true);
        setNotificationError(true);
      })
      .finally(() => {
        setLoadingTodos(false);
        setTimeout(() => {
          setNotificationError(false);
          setErrorTodos(false);
        }, 3000);
      });
  }

  useEffect(() => {
    setLoadingTodos(true);
    loadTodos();
  }, []);

  function addTodo(newTodo: Todo) {
    setLoadingPostTodo(true);
    const { id, ...data } = newTodo;

    postTodo(data)
      .then(serverTodo => {
        setTempTodo(serverTodo);
        setTodos(currentTodo => [...currentTodo, serverTodo]);
        setCounter(currentCounter => currentCounter + 1);
      })
      .catch(() => {
        setNotificationError(true);
        setErrorPostTodo(true);
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingPostTodo(false);

        setTimeout(() => {
          setNotificationError(false);
          setErrorPostTodo(false);
        }, 3000);
      });
  }

  useEffect(() => {
    if (tempTodo) {
      addTodo(tempTodo);
    }
  }, [tempTodo]);

  useEffect(() => {
    if (notificationError) {
      setTimeout(() => {
        setNotificationError(false);
      }, 3000);
    }
  }, [notificationError]);

  function deleteById(todoId: number, isSingle = false) {
    setDeletingIds(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setCounter(currentCounter => currentCounter - 1);
      })
      .catch(() => {
        setNotificationError(true);
        setDeleteError(true);
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
        if (isSingle) {
          setLoaderDelete(false);
          setSelectedDeleteTodo(null);
        }

        setTimeout(() => {
          setNotificationError(false);
          setDeleteError(false);
        }, 3000);
      });
  }

  useEffect(() => {
    if (selectedDeleteTodo) {
      setLoaderDelete(true);
      deleteById(selectedDeleteTodo, true);
    }
  }, [selectedDeleteTodo]);

  function deletAllCompletedTodos(todosArr: Todo[]) {
    const completedTodos = todosArr.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => deleteById(todo.id))).finally(() => {
      setLoaderDeleteCompleted(false);
      setClearButton(false);
    });
  }

  useEffect(() => {
    if (clearButton) {
      setLoaderDeleteCompleted(true);
      deletAllCompletedTodos(todos);
    }
  }, [clearButton]);

  function todoUpdateById(todo: Todo, isSingle = false) {
    const { id, completed } = todo;

    setUpdatingIds(prev => [...prev, id]);

    return updateTodo({ id, completed })
      .then(newTodo => {
        setTodos(currentTodos => {
          const newPosts = [...currentTodos];
          const index = currentTodos.findIndex(t => t.id === newTodo.id);

          newPosts.splice(index, 1, newTodo);

          return newPosts;
        });
      })
      .catch(() => {
        setNotificationError(true);
        setToggleError(true);
      })
      .finally(() => {
        setUpdatingIds(prev => prev.filter(todoId => todoId !== id));
        if (isSingle) {
          setLoaderToggle(false);
          setToggleTodo(null);
        }

        setTimeout(() => {
          setNotificationError(false);
          setToggleError(false);
        }, 3000);
      });
  }

  useEffect(() => {
    if (toggleTodo) {
      setLoaderToggle(true);
      todoUpdateById(toggleTodo, true);
    }
  }, [toggleTodo]);

  function toggleAll() {
    const todosToUpdate = includesFalseCompleted
      ? todos
      : todos.filter(t => !t.completed);

    setsIClickToggleAllButton(false);
    setLoadingIds(todosToUpdate.map(t => t.id));

    Promise.all(todosToUpdate.map(todo => todoUpdateById(todo))).finally(() => {
      setLoadingIds([]);
    });
  }

  useEffect(() => {
    if (isClickToggleAllButton) {
      toggleAll();
    }
  }, [isClickToggleAllButton]);

  function updateEditTodo(todo: EditTodo) {
    const { id, title } = todo;

    editingTodo({ id, title })
      .then(newTodo => {
        setTodos(currentTodos => {
          const newPosts = [...currentTodos];
          const index = currentTodos.findIndex(t => t.id === newTodo.id);

          newPosts.splice(index, 1, newTodo);

          return newPosts;
        });
        setSelectedUpdateTodo(null);
      })
      .catch(() => {
        setNotificationError(true);
        setToggleError(true);
      })
      .finally(() => {
        setEditTodo(null);
        setTimeout(() => {
          setNotificationError(false);
          setToggleError(false);
        }, 3000);
      });
  }

  useEffect(() => {
    if (editTodo) {
      updateEditTodo(editTodo);
    }
  }, [editTodo]);

  if (!USER_ID) {
    return (
      <section className="section">
        <p className="box is-size-3">
          Please get your <b> userId </b>{' '}
          <a href="https://mate-academy.github.io/react_student-registration">
            here
          </a>{' '}
          and save it in the app <pre>const USER_ID = ...</pre>
          All requests to the API must be sent with this
          <b> userId.</b>
        </p>
      </section>
    );
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          todos={todos}
          includesFalseCompleted={includesFalseCompleted}
          loaderClearButton={loaderDeleteCompleted}
          loaderDeleteButton={loaderDelete}
          loadingPostTodo={loadingPostTodo}
          title={titleTodo}
          setTitle={setTitleTodo}
          setNotificationError={setNotificationError}
          setTempTodo={setTempTodo}
          setErrorTitle={setErrorTitle}
          errorPostTodo={errorPostTodo}
          onClickToggleAll={setsIClickToggleAllButton}
        />

        <TodoAppMain
          deletingIds={deletingIds}
          updatingIds={updatingIds}
          selectedUpdateTodo={selectedUpdateTodo}
          setSelectedUpdateTodo={setSelectedUpdateTodo}
          editTodo={editTodo}
          setEditTodo={setEditTodo}
          loadingIds={loadingIds}
          loaderToggle={loaderToggle}
          setToggleTodo={setToggleTodo}
          todos={visibleTodos}
          tempTodo={tempTodo}
          loaderDelete={loaderDelete}
          onSelectedTodo={setSelectedDeleteTodo}
          loaderClearButton={loaderDeleteCompleted}
        />

        {todos.length > 0 && (
          <TodoMainFooter
            filterTodos={filterTodos}
            todos={todos}
            onFilterTodos={setFilterTodos}
            setTodos={setTodos}
            counter={counter}
            setClearButton={setClearButton}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !notificationError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setNotificationError(false)}
        />
        {errorTodos && !loadingTodos && <span>{ErrorMessage.LoadTodos}</span>}
        {errorTitle && <span>{ErrorMessage.EmptyTitle}</span>}
        {errorPostTodo && <span>{ErrorMessage.AddTodo}</span>}
        {deleteError && <span>{ErrorMessage.DeleteTodo}</span>}
        {toggleError && <span>{ErrorMessage.ToggleTodo}</span>}
      </div>
    </div>
  );
};
