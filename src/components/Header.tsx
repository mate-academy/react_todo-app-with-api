/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErorrType';

type Props = {
  todos: Todo[],
  addTodo:(title: string) => void;
  setErrorMessage: (error: string) => void;
  tempTodo: Todo | null;
  todoStatusAll:() => void;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  setErrorMessage,
  tempTodo,
  todoStatusAll,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorType.Title);

      return;
    }

    addTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 1 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every((todo) => todo.completed),
          })}
          onClick={todoStatusAll}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
