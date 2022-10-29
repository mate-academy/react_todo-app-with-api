import { FormEventHandler, RefObject } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  todos: Todo[];
  completedTodos: Todo[],
  handleToggal: () => void,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  title,
  handleSubmit,
  setTitle,
  completedTodos,
  handleToggal,
  todos,
}) => {
  return (

    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length === completedTodos.length,
        })}
        onClick={handleToggal}
        aria-label="tog"
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
