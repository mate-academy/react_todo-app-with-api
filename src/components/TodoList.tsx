import { FC, memo } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  handleComplete: (id: number, completed: boolean) => void;
  handleDelete: (id: number) => void;
  isUpdatingId: number[];
  isEditing: number | null;
  handleEdit: (id: number, title: string) => void;
  query: string;
  setQuery: (title: string) => void;
  handleEditSubmit: (query: string, id: number) => void;
  tempTodo: Todo | null;
}

export const TodoList: FC<Props> = memo(({
  todos,
  handleComplete,
  handleDelete,
  isUpdatingId,
  isEditing,
  handleEdit,
  query,
  setQuery,
  handleEditSubmit,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleComplete={handleComplete}
          isEditing={isEditing}
          handleEditSubmit={handleEditSubmit}
          query={query}
          setQuery={setQuery}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          isUpdatingId={isUpdatingId}
        />
      ))}
      {tempTodo && (
        <div id={`${tempTodo.id}`} data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
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
