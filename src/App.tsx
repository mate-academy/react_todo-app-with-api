/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useContext,
} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import * as todoService from './api/todos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodosFilter';
import { Notification } from './components/Notification';
import { UserWarning } from './UserWarning';
import { TodosContext } from './TodosContext';
import { USER_ID } from './utils/constants';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    setToBeCleared,
    setToBeToggled,
  } = useContext(TodosContext);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.Load);
      });
  }, []);

  const [completed, active]: number[] = useMemo(() => {
    return todos.reduce((acc, todo) => {
      return todo.completed ? [acc[0] + 1, acc[1]] : [acc[0], acc[1] + 1];
    }, [0, 0]);
  }, [todos]);

  const handleClear = () => {
    setToBeCleared(todos
      .filter(todo => todo.completed)
      .map(todo => todo.id));
  };

  const handleToggle = () => {
    setToBeToggled(todos
      .filter(todo => (active ? !todo.completed : true))
      .map(todo => todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: completed === todos.length,
            })}
            onClick={handleToggle}
          />

          <TodoForm />
        </header>

        {!!todos.length && (
          <>
            <section className="todoapp__main">
              <TodoList />
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${active} items left`}
              </span>

              <TodosFilter />

              {!!completed && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={handleClear}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      <TransitionGroup>
        {errorMessage !== Error.Absent && (
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
