import { FC, useCallback } from 'react';
import classNames from 'classnames';
import { USER_ID } from '../../utils/fetchClient';
import { NewTodoData, Todo } from '../../types/Todo';

interface HeaderProps {
  addTodo: (newTodo: NewTodoData) => void;
  onTitleError: (hasTitle: boolean) => void;
  onError: () => void;
  onUpdate: () => void;
  todos: Todo[],
  title: string;
  onSetTitle: (title: string) => void;
}

export const Header: FC<HeaderProps> = ({
  addTodo,
  onTitleError,
  onError,
  onUpdate,
  todos,
  title,
  onSetTitle,
}) => {
  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      onError();
      onTitleError(true);
    } else {
      const todoData: NewTodoData = {
        userId: USER_ID,
        title,
        completed: false,
      };

      addTodo(todoData);

      onSetTitle('');
    }
  }, [title]);

  const allTodosCompleted = todos.every((todo) => todo.completed);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        onClick={onUpdate}
      />

      <form
        action="/users"
        method="POST"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => onSetTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
