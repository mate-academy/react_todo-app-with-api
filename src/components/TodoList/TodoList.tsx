/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  selectedTodoId: number[];
  isEditing: number | null;
  newTitle: string;
  onDelete: (value: number) => void;
  onToggle: (value: number, index: number) => void;
  onStartEditing: (value: string, id: number) => void;
  onNewTodoTitle: (value: string) => void;
  onChangeTodoTitle: (
    event: React.FormEvent,
    todo: Todo,
    index: number,
  ) => void;
  onKey: (event: React.KeyboardEvent) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  selectedTodoId,
  isEditing,
  newTitle,
  onDelete,
  onToggle,
  onStartEditing,
  onNewTodoTitle,
  onChangeTodoTitle,
  onKey,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo, i) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={i}
          isEditing={isEditing}
          selectedTodoId={selectedTodoId}
          newTitle={newTitle}
          onDelete={onDelete}
          onToggle={onToggle}
          onStartEditing={onStartEditing}
          onNewTodoTitle={onNewTodoTitle}
          onChangeTodoTitle={onChangeTodoTitle}
          onKey={onKey}
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
};
