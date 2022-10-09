import React, {
  FormEvent,
  ChangeEvent,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  newTodoField: React.RefObject<HTMLInputElement>,
  onAddTodo: (event: FormEvent) => void,
  title: string,
  setTitle: (value:string) => void,
  isAdding: boolean,
  handleToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoField,
  onAddTodo,
  title,
  setTitle,
  isAdding,
  handleToggleAll,
}) => {
  const setInputTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const toggleAll = todos.every(({ completed }) => completed);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle-button"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', { active: toggleAll })}
        onClick={handleToggleAll}
      />

      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding}
          onChange={setInputTitle}
        />
      </form>
    </header>
  );
};
