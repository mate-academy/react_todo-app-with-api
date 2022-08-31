import { useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  isAllTodosCompleted: boolean,
  onToggleBtnClick: () => void,
  onNewTodoFormSubmit: (e: React.FormEvent) => void,

};

export const Header: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  isAllTodosCompleted,
  onToggleBtnClick,
  onNewTodoFormSubmit,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  return (
    <header className="todoapp__header">
      {todos.length > 0
        && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              {
                active: isAllTodosCompleted,
              },
            )}
            onClick={onToggleBtnClick}
          >
            &nbsp;
          </button>
        )}

      <form
        name="NewTodo"
        onSubmit={(e) => {
          onNewTodoFormSubmit(e);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </form>
    </header>
  );
};
