import classNames from 'classnames';
import { FormEvent, RefObject } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  handleSubmit: (event: FormEvent) => void;
  newTodoField: RefObject<HTMLInputElement>;
  title: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isAdd: boolean;
  toggleAllTodos: () => void;
  activeTodos: Todo[] | [];
}

export const Header: React.FC<Props> = ({
  handleSubmit,
  newTodoField,
  title,
  handleChange,
  isAdd,
  toggleAllTodos,
  activeTodos,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="close"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !activeTodos },
        )}
        onClick={toggleAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={isAdd}
        />
      </form>
    </header>
  );
};
