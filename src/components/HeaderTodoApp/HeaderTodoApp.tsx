/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FC, FormEvent, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../userId';

interface Props {
  todos: Todo[];
  onCreate: (todoData: Todo) => void;
  tempTodo: Todo | null;
  onChangeTodo: (todo: Todo, value: boolean | string) => void;
  onError: (error: string) => void;
}

export const HeaderTodoApp: FC<Props> = React.memo(({
  todos,
  onCreate,
  tempTodo,
  onChangeTodo,
  onError,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onError("Title can't be empty");

      return;
    }

    await onCreate({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    setTitle('');
  };

  const handleClick = () => {
    const isSomeActive = todos.some(({ completed }) => completed === false);

    todos.forEach(todo => {
      if (isSomeActive !== todo.completed) {
        onChangeTodo(todo, isSomeActive);
      }
    });
  };

  const active = todos.every(({ completed }) => completed === true);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active })}
          onClick={handleClick}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
});
