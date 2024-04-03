import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from '../UserWarning';
import { USER_ID, getTodos } from '../api/todos';
import { ErrorMessage, FilterBy, Todo } from '../types';
import { TodoList } from './TodoList';
import { Header } from './Header';
import { Footer } from './Footer';
import {
  ErrorMessageContext,
  SetErrorMessageContext,
  TodosContext,
} from '../Contexts';

export const TodoApp: React.FC = () => {
  const [filterBy, setFilterBy] = useState('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const { todosContext, setTodosContext } = useContext(TodosContext);
  const errorMessage = useContext(ErrorMessageContext);
  const setErrorMessage = useContext(SetErrorMessageContext);

  const { todos } = todosContext;

  const toggledAllCompleted = useMemo(() => {
    return !todos.some(todo => !todo.completed);
  }, [todos]);

  const todosToShow = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.Active:
          return !todo.completed;
        case FilterBy.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodosContext(prevTodosContext => (
        {
          ...prevTodosContext,
          todos: todosFromServer,
        })),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.load);
      });
  }, [setTodosContext, setErrorMessage]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (errorMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage(ErrorMessage.noError);
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [errorMessage, setErrorMessage]);

  const handleFilterClick = (e: React.MouseEvent) => {
    setFilterBy(e.currentTarget.innerHTML);
  };

  const handleHideErrorMessage = useCallback(() => {
    setErrorMessage(ErrorMessage.noError);
  }, [setErrorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          setTempTodo={setTempTodo}
          toggledAllCompleted={toggledAllCompleted}
        />
        {(todos.length !== 0 || tempTodo !== null) && (
          <>
            <TodoList
              todosToShow={todosToShow}
              tempTodo={tempTodo}
              toggledAllCompleted={toggledAllCompleted}
            />
            <Footer filterBy={filterBy} handleFilterClick={handleFilterClick} />
          </>
        )}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="hide error"
          onClick={handleHideErrorMessage}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
