/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import {
  Actions,
  DispatchContext,
  Keys,
  StateContext,
} from '../Store';
import { createTodo, updateTodo } from '../../api/todos';

interface Props {
  USER_ID: number,
  completedTodos: Todo[],
  setErrorMessage: (msg: string) => void;
  setTempTodo: (todo: Todo | null) => void;
}

export const Header: React.FC<Props> = ({
  USER_ID,
  completedTodos,
  setErrorMessage,
  setTempTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const dispatch = useContext(DispatchContext);
  const {
    allTodos,
  } = useContext(StateContext);

  useEffect(() => {
    const currentInputRef = inputRef.current;

    if (currentInputRef) {
      currentInputRef.focus();
    }
  });

  const handleToogleAll = () => {
    allTodos.forEach((todo: Todo) => {
      updateTodo({
        id: todo.id,
        completed: !(allTodos.length === completedTodos.length),
        title: todo.title,
      })
        .then(() => {
          dispatch({
            type: Actions.mark,
            todo: {
              ...todo,
              completed: (allTodos.length === completedTodos.length),
            },
          });
        })
        .catch(() => {
          dispatch({ type: Actions.setUpdatingError });
        });

      return {
        ...todo,
        completed: !(allTodos.length === completedTodos.length),
      };
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleNewTodo = () => {
    if (todoTitle.trim()) {
      const newTitle = todoTitle;

      setInputDisabled(true);
      setTempTodo({
        id: 0,
        title: todoTitle.trim(),
        completed: false,
        userId: USER_ID,
      });

      createTodo({
        title: todoTitle.trim(),
        completed: false,
        userId: USER_ID,
      })
        .then(newTodo => {
          dispatch({
            type: Actions.addNew,
            todo: newTodo,
          });
          setTodoTitle('');
        })
        .catch(() => {
          setTodoTitle(newTitle);
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setInputDisabled(false);

          const currentInputRef = inputRef.current;

          if (currentInputRef !== null) {
            currentInputRef.focus();
          }
        });
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === Keys.Enter) {
      e.preventDefault();

      handleNewTodo();
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allTodos.length !== completedTodos.length,
        })}
        data-cy="ToggleAllButton"
        disabled={!allTodos.length}
        onClick={handleToogleAll}
      />

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
