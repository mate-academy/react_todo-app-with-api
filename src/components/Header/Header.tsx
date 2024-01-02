import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[]
  toggleAllTodos: () => void
  createTodo: (event: React.FormEvent<HTMLFormElement>) => void
  titleRef: React.RefObject<HTMLInputElement>
  todoTitle: string
  setTodoTitle: React.Dispatch<React.SetStateAction<string>>
  loadingTodoIds: number[]
}

export const Header: React.FC<Props> = ({
  todos,
  toggleAllTodos,
  createTodo,
  titleRef,
  todoTitle,
  setTodoTitle,
  loadingTodoIds,
}) => (
  <header className="todoapp__header">
    {todos.length > 0 && (
      <button
        aria-label="Toggle Button"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={toggleAllTodos}
      />
    )}

    <form onSubmit={createTodo}>
      <input
        ref={titleRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={(event) => setTodoTitle(event.target.value)}
        disabled={loadingTodoIds.length > 0}
      />
    </form>
  </header>
);
