import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  todoInputRef: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isAdding: boolean;
  handleToggleAll: () => void;
}

export const HeaderTodo: React.FC<Props> = ({
  todos,
  todoInputRef,
  title,
  setTitle,
  handleSubmit,
  isAdding,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(t => t.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
