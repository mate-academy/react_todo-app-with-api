import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todoInput: React.RefObject<HTMLInputElement>;
  title: string;
  onTodoSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTitleChange: (newTitle: string) => void;
  loading: boolean;
  onMakeAllCompleted: () => void;
  isToggledAll: boolean;
  isRendered: boolean;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  todoInput,
  title,
  onTodoSubmit,
  onTitleChange,
  loading,
  onMakeAllCompleted,
  isToggledAll,
  isRendered,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {isRendered && todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isToggledAll,
          })}
          data-cy="ToggleAllButton"
          onClick={onMakeAllCompleted}
        />
      )}
      {/* Add a todo on form submit */}
      <form onSubmit={event => onTodoSubmit(event)}>
        <input
          ref={todoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={loading}
          onChange={event => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
