/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { ADDING_ERROR, TITLE_ERROR, USER_ID } from '../utils/constants';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  activeLength: number;
  todosLength: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  errorHandler: (str: string) => void;
  tempTodo: Todo | null;
  updateTodoStatus: (id: number, completed: boolean) => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export const Header: React.FC<Props> = ({
  todos,
  activeLength,
  todosLength,
  setTodos,
  setTempTodo,
  errorHandler,
  tempTodo,
  updateTodoStatus,
  title,
  setTitle,
}) => {
  const titleRef = React.useRef<HTMLInputElement | null>(null);

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    titleRef.current?.focus();

    const validTitle = title.trim() !== '';

    if (!validTitle) {
      errorHandler(TITLE_ERROR);
    } else {
      const newTodo = {
        title,
        userId: +USER_ID,
        completed: false,
        id: 0,
      };

      setTempTodo(newTodo);

      addTodo(USER_ID, newTodo)
        .then((todo) => {
          setTodos((prevTodos) => [...prevTodos, todo]);
          setTitle('');
          setTempTodo(null);
        })
        .catch(() => {
          errorHandler(ADDING_ERROR);
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const toggleAll = () => {
    todos.forEach((todo) => {
      if ((todosLength - activeLength === 0)
      || (todosLength - activeLength === todosLength)
      || todo.completed === false) {
        updateTodoStatus(todo.id, !todo.completed);
      }
    });
  };

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${cn({ active: activeLength === 0 })}`}
          onClick={() => toggleAll()}
        />
      )}

      <form onSubmit={(event) => formSubmit(event)}>
        <input
          ref={titleRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          readOnly={!!tempTodo}
        />
      </form>
    </header>
  );
};
