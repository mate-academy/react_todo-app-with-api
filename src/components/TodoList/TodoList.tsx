import { Todo } from '../../types/Todo';
import { TodoCard } from '../Todo/Todo';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  tempTodo: Todo | null,
  onDelete: (todoId: number) => void,
  deletingTodoId: number,
  isClearCompleted: boolean,
  onStatusChange: (id: number, data: boolean) => void,
  isToggle: boolean,
  onEditing: (id: number, data: string) => void,
  setEditingId: (id: number) => void
  editingId: number,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  tempTodo,
  onDelete,
  deletingTodoId,
  isClearCompleted,
  onStatusChange,
  isToggle,
  onEditing,
  editingId,
  setEditingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          deletingTodoId={deletingTodoId}
          isClearCompleted={isClearCompleted}
          onStatusChange={onStatusChange}
          isToggle={isToggle}
          onEditing={onEditing}
          setEditingId={setEditingId}
          editingId={editingId}
        />
      ))}
      {isAdding && tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
