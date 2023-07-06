import React, { FC, useState } from 'react';
import cn from 'classnames';

interface Props {
  changeError: (error: string) => void;
  addTodo: (title: string) => void;
  toggleAllTodos: () => void;
  isAllCompleted: boolean;
  hasTodos: boolean
}

export const TodoHeader: FC<Props> = ({
  changeError,
  addTodo,
  toggleAllTodos,
  isAllCompleted,
  hasTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const submitTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      changeError('Title can\'t be empty');

      return;
    }

    addTodo(todoTitle);
    setTodoTitle('');
  };

  const changeTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          aria-label="toggle-all"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={submitTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={changeTodoTitle}
        />
      </form>
    </header>
  );
};
