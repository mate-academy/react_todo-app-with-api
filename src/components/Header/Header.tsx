/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import './Header.scss';
import { TodosContext } from '../TodosContext';
import { createTodo, updateTodo } from '../../api/todos';

const USER_ID = 11677;

export const Header: React.FC = () => {
  const {
    todos,
    dispatch,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    setLoadingTodosIds,
  } = useContext(TodosContext);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isToggleAllActive, setIsToggleAllActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllActive = useMemo(() => {
    return !todos.some(todo => todo.completed === false);
  }, [todos]);

  useEffect(() => {
    setIsToggleAllActive(isAllActive);
  }, [isAllActive]);

  useEffect(() => inputRef.current?.focus());

  const handleToggleAllClick = () => {
    const toggledTodos = todos.filter(todo => {
      return isAllActive || !todo.completed;
    });

    setLoadingTodosIds(toggledTodos.map(todo => todo.id));

    todos.map(todo => {
      if (isAllActive || !todo.completed) {
        return updateTodo(todo.id, { completed: !isAllActive })
          .then(() => {
            dispatch({
              type: 'toggle',
              payload: {
                ...todo,
                completed: !isAllActive,
              },
            });
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
          })
          .finally(() => setLoadingTodosIds([]));
      }

      return todo;
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleTodoSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (trimmedTitle.length) {
      const newTodo = {
        id: +new Date(),
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      setTempTodo(newTodo);

      dispatch({
        type: 'add',
        payload: newTodo,
      });

      createTodo(newTodo)
        .then(() => {
          setNewTodoTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          dispatch({
            type: 'remove',
            payload: newTodo.id,
          });
        })
        .finally(() => {
          setTempTodo(null);
        });
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  const handleTitleReset = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          id="toggle-all"
          className={classNames('todoapp__toggle-all', {
            active: isToggleAllActive,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form
        onSubmit={handleTodoSubmit}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!tempTodo}
          value={newTodoTitle}
          onChange={handleTitleChange}
          onKeyUp={handleTitleReset}
        />
      </form>
    </header>
  );
};
