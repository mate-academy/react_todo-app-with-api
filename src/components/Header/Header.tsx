import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  todos: Todo[],
  toggleClick: (todo: Todo) => void,
  toggleAllClick: () => void,
  areAllTodosCompleted: boolean,
  isTitleDisabled: boolean,
  setIsTitleDisabled: (isDisabled: boolean) => void,
  createTodo: (title: string) => void,
  todoTitle: string,
  setTodoTitle: (title: string) => void,
  setTempTodo: (todo: unknown | null) => void,
};

export const Header: React.FC<Props> = ({
  toggleAllClick,
  areAllTodosCompleted,
  isTitleDisabled,
  setIsTitleDisabled,
  createTodo,
  todoTitle,
  setTodoTitle,
  setTempTodo,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTitleDisabled(true);
    createTodo(todoTitle);
    setTempTodo({ id: 0 });
  };

  const inputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isTitleDisabled && document.activeElement !== inputReference.current) {
      inputReference.current?.focus();
    }
  }, [isTitleDisabled]);

  return (
    <header className="todoapp__header">
      <button
        title="All"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: areAllTodosCompleted },
        )}
        onClick={() => toggleAllClick()}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputReference}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isTitleDisabled}
        />
      </form>
    </header>
  );
};
