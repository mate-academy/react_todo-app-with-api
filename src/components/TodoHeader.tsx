import React, {
  ChangeEvent,
  FormEvent,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isTodoLoading: boolean;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleToggleButton: () => void;
  todoTitle: string
  setTodoTitle: (input: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodoTitle,
  handleFormSubmit,
  handleToggleButton,
  todoTitle,
  isTodoLoading,
}) => {
  const isToggleButtonVisible = todos.every(todo => todo.completed);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isToggleButtonVisible,
        })}
        aria-label="todoapp__toggle-all"
        onClick={handleToggleButton}
      />

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInputChange}
          disabled={isTodoLoading}
        />
      </form>
    </header>
  );
};
