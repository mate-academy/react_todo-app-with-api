import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';

type Props = {
  count: number,
  isActiveCount: number,
  addNewTodo: (todoTitle: string) => Promise<void>
  // toggleTodosStatus: (status: boolean) => Promise<void>
};

export const Header: React.FC<Props> = ({
  count,
  isActiveCount,
  addNewTodo,
  // toggleTodosStatus,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    addNewTodo(todoTitle);
    setTodoTitle('');
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {count > 0 && (
        <button
          aria-label="complited todo"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !isActiveCount,
          })}
          // onClick={toggleTodosStatus}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInput}
        />
      </form>
    </header>
  );
};
