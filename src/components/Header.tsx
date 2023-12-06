import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  newTodoTitle: string,
  countActiveTodos: number,
  isRequesting: boolean,
  handleToggleTodo: () => void,
  addNewTodo: (todoTitle:string) => void,
  setNewTodoTitle: (newTitle: string) => void
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoTitle,
  tempTodo,
  countActiveTodos,
  isRequesting,
  setNewTodoTitle,
  handleToggleTodo,
  addNewTodo,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNewTodo(newTodoTitle);
  };

  const handleChangeTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: !countActiveTodos })}
          data-cy="ToggleAllButton"
          onClick={handleToggleTodo}
          aria-label="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newTodoTitle}
          onChange={handleChangeTodoTitle}
          disabled={isRequesting}
        />
      </form>
    </header>
  );
};
