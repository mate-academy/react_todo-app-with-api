import { forwardRef, Dispatch } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: Dispatch<React.SetStateAction<string>>;
  toggleAll: () => void;
  isToggleVisible: boolean;
}

const Header = forwardRef<HTMLInputElement, Props>(
  ({ todos, addTodo, title, setTitle, toggleAll, isToggleVisible }, ref) => {
    return (
      <header className="todoapp__header">
        {!!todos.length && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: isToggleVisible })}
            data-cy="ToggleAllButton"
            onClick={toggleAll}
          />
        )}

        <form onSubmit={addTodo}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={ref}
            value={title}
            onChange={event => setTitle(event.target.value.trimStart())}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'header';

export default Header;
