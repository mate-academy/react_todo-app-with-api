import { useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  onToggleBtnClick: (isEveryTodoCompleted: boolean) => void,
  onNewTodoFormSubmit: (e: React.FormEvent) => void,

};

export const Header: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  onToggleBtnClick,
  onNewTodoFormSubmit,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const isEveryTodoCompleted = todos.every(todo => todo.completed);

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
                active: isEveryTodoCompleted,
              },
            )}
            onClick={() => onToggleBtnClick(isEveryTodoCompleted)}
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
