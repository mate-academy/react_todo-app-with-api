/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TypeError } from './types/TypeError';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

const USER_ID = 6270;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [typeError, setTypeError] = useState('');
  const [textError, setTextError] = useState('');
  const [filterByStatus, setFilterByStatus] = useState(Status.All);
  const [disableInput, setDisableInput] = useState(false);
  const [idTodosLoading, setIdTodosLoading] = useState<number[]>([]);
  const [titleTodo, setTitleTodo] = useState('');

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const areAllTodosCompleted = todos.every(todo => todo.completed);

  const deleteHandler = (todoId?: number) => {
    setTypeError('');
    const todoIdsForDeleting = todoId
      ? [todoId]
      : completedTodos.map(todo => todo.id);

    setIdTodosLoading(todoIdsForDeleting);
    const clearingTodos = todoIdsForDeleting.map(id => deleteTodo(id));

    Promise.all(clearingTodos)
      .then(() => {
        setTodos(todoId
          ? todos.filter(todo => todo.id !== todoId)
          : [...activeTodos]);
      })
      .catch(() => {
        setTypeError(TypeError.Delete);
        setTextError(TypeError.Delete);
      })
      .finally(() => {
        setIdTodosLoading([]);
      });
  };

  const updateHandler = (todoId: number, title?: string) => {
    const indexCurrentTodo = todos.findIndex(todo => todo.id === todoId);
    const data = title
      ? { title }
      : { completed: !todos[indexCurrentTodo].completed };

    setTypeError('');
    setIdTodosLoading([todoId]);

    updateTodo(todoId, data)
      .then((updatedTodo) => {
        todos.splice(indexCurrentTodo, 1, updatedTodo);
        setTodos([...todos]);
      })
      .catch(() => {
        setTypeError(TypeError.Update);
        setTextError(TypeError.Update);
      })
      .finally(() => setIdTodosLoading([]));
  };

  const toggleAllHandler = () => {
    const todoIdsForToggle = areAllTodosCompleted
      ? completedTodos.map(todo => todo.id)
      : activeTodos.map(todo => todo.id);
    const data = { completed: !areAllTodosCompleted };

    setTypeError('');
    setIdTodosLoading(todoIdsForToggle);
    const togglingTodos = todoIdsForToggle.map(id => updateTodo(id, data));

    Promise.all(togglingTodos)
      .then((results) => {
        setTodos(areAllTodosCompleted
          ? results
          : todos.map(todo => ({ ...todo, completed: true })));
      })
      .catch(() => {
        setTypeError(TypeError.Update);
        setTextError(TypeError.Update);
      })
      .finally(() => setIdTodosLoading([]));
  };

  const addHandler = () => {
    if (!titleTodo) {
      setTypeError(TypeError.TitleIsEmpty);
      setTextError(TypeError.TitleIsEmpty);

      return;
    }

    const data = {
      userId: USER_ID,
      title: titleTodo,
      completed: false,
    };

    setTypeError('');
    setDisableInput(true);
    setTempTodo({ ...data, id: 0 });

    createTodo(data)
      .then((addedTodo) => {
        setTodos([...todos, addedTodo]);
        setTitleTodo('');
      })
      .catch(() => {
        setTypeError(TypeError.Add);
        setTextError(TypeError.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setDisableInput(false);
      });
  };

  const closeErrorMessage = () => setTypeError('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(loadedTodos => setTodos(loadedTodos))
      .catch(() => {
        setTypeError(TypeError.Unexpected);
        setTextError(TypeError.Unexpected);
      });
  }, []);

  useEffect(() => {
    const timerId = setTimeout(setTypeError, 3000, '');

    return () => clearTimeout(timerId);
  }, [typeError]);

  const visibleTodos = useMemo(() => {
    switch (filterByStatus) {
      case Status.Active:
        return activeTodos;

      case Status.Completed:
        return completedTodos;

      default:
        return todos;
    }
  }, [filterByStatus, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allTodosCompleted={areAllTodosCompleted}
          disableInput={disableInput}
          titleTodo={titleTodo}
          setTitleTodo={setTitleTodo}
          addHandler={addHandler}
          onToggleAll={toggleAllHandler}
        />

        {!!todos.length && (
          <>
            <section className="todoapp__main">
              <TransitionGroup>
                {visibleTodos.map(todo => (
                  <CSSTransition
                    key={todo.id}
                    timeout={500}
                    classNames="item"
                  >
                    <TodoItem
                      todo={todo}
                      deleteHandler={deleteHandler}
                      isProcessed={idTodosLoading.includes(todo.id)}
                      onUpdate={updateHandler}
                    />
                  </CSSTransition>
                ))}
                {tempTodo && (
                  <CSSTransition
                    key={0}
                    timeout={500}
                    classNames="temp-item"
                  >
                    <TodoItem
                      todo={tempTodo}
                      isProcessed
                    />
                  </CSSTransition>
                )}
              </TransitionGroup>
            </section>

            <Footer
              itemsLeft={activeTodos.length}
              filterByStatus={filterByStatus}
              setFilterByStatus={setFilterByStatus}
              areTodosCompleted={completedTodos.length > 0}
              clearCompleted={deleteHandler}
            />
          </>
        )}
      </div>

      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !typeError },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={closeErrorMessage}
        />
        {textError}
      </div>
    </div>
  );
};
