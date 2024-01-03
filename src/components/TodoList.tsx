import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodo: Todo[];
  removeTodo: (value: number) => void;
  toggleTodo: (value: number) => void;
  handleDoubleClick: () => void;
  handleEditingChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    editingId: number
  ) => void;
  isEditing: boolean,
  handleBlur: () => void,
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>,
    editingId: number) => void,
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  removeTodo,
  toggleTodo,
  handleDoubleClick,
  handleEditingChange,
  handleKeyPress,
  isEditing,
  handleBlur,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map((todo) => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              onClick={() => toggleTodo(todo.id)}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          {isEditing ? (
            <input
              type="text"
              value={todo.title}
              className="edit"
              onBlur={handleBlur}
              onChange={(e) => handleEditingChange(e, todo.id)}
              onKeyPress={(e) => handleKeyPress(e, todo.id)}
            />
          ) : (
            <>
              <span
                onDoubleClick={handleDoubleClick}
                data-cy="TodoTitle"
                className="todo__title"
              >
                {todo.title}

              </span>
            </>
          )}

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
