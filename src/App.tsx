/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import * as todoServices from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { USER_ID } from './utils/USER_ID';
import { useTodo } from './api/useTodo';
import { Error } from './types/Error';
import { Notification } from './components/Notifiction';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    setCleared,
    setToggled,
  } = useTodo();

  useEffect(() => {
    todoServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.Load);
      });
  }, []);

  const [completed, active] = useMemo(() => {
    return todos.reduce((acc, todo) => {
      return todo.completed ? [acc[0] + 1, acc[1]] : [acc[0], acc[1] + 1];
    }, [0, 0]);
  }, [todos]);

  const handleClear = () => {
    setCleared(todos
      .filter(currentTodo => currentTodo.completed)
      .map(currentTodo => currentTodo.id));
  };

  const handleToggle = () => {
    setToggled(todos
      .filter(todo => (active ? !todo.completed : true))
      .map(todo => todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleToggle={handleToggle}
        />

        {!!todos.length && (
          <>
            <TodoList />

            <TodoFooter
              completed={completed}
              active={active}
              handleClear={handleClear}
            />
          </>
        )}

      </div>

      <TransitionGroup>
        {!!errorMessage && (
          <CSSTransition
            timeout={500}
            classNames="error"
          >
            <Notification />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};
