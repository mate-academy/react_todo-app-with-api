import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoEditItem } from './TodoEditItem';
import { useTodoContext } from '../../context/TodoContext';

type TodoItemProps = {
  todo: Todo;
  isLoading?: boolean;
};

const TodoItem = ({
  todo, isLoading,
}: TodoItemProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { updateTodo, removeTodo } = useTodoContext();

  return (
    <div
      key={todo.id}
      className={`todo ${todo.completed && 'completed'}`}
      onDoubleClick={() => setIsEditMode(true)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onChange={() => updateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditMode ? (
        <TodoEditItem
          todo={todo}
          closeEditForm={() => setIsEditMode(false)}
        />
      ) : (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div className={`modal overlay ${isLoading && 'is-active'}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
