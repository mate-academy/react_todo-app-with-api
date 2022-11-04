import classNames from 'classnames';
import React, {
  ChangeEvent, FormEvent, RefObject, useCallback,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  newTodoField: RefObject<HTMLInputElement>;
  createTodo: (param: FormEvent) => Promise<void>;
  title: string;
  setTitle: (param: string) => void;
  handleChangeAll: (param: any) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoField,
  createTodo,
  title,
  setTitle,
  handleChangeAll,
}) => {
  const handleChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    }, [title],
  );

  return (
    <header className="todoapp__header">
      <button
        aria-label="button"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.every(todo => todo.completed) },
        )}
        onClick={handleChangeAll}
      />

      <form onSubmit={createTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={title}
          className="todoapp__main-title"
          placeholder="What needs to be done?"
          onChange={handleChangeInput}
        />
      </form>
    </header>
  );
};
