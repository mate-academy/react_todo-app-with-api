import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  deletingTodosId: number[];
  onToggleTodoStatus: (id: number, status: boolean) => void;
  changeTodoTitle: (id: number, title: string) => void;
}

export const TodoList: FC<Props> = memo(({
  todos,
  tempTodo,
  onDelete,
  deletingTodosId,
  onToggleTodoStatus,
  changeTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          deletingTodosId={deletingTodosId}
          onToggleTodoStatus={onToggleTodoStatus}
          changeTodoTitle={changeTodoTitle}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
});
