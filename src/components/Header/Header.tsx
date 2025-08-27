import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  mainInput: React.RefObject<HTMLInputElement>;
  handleSubmit: (event: React.FormEvent) => void;
  updateTodo: (value: Todo) => Promise<void>;
  isSubmitting: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  mainInput,
  handleSubmit,
  isSubmitting,
  updateTodo,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            const allCompleted = todos.every(td => td.completed);

            const newCompleted = !allCompleted;
            const todosToUpdate = todos.filter(
              td => td.completed !== newCompleted,
            );

            todosToUpdate.forEach(todo => updateTodo(todo));
          }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={mainInput}
        />
      </form>
    </header>
  );
};
