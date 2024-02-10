import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todo: number) => void,
  onTodoEdit: (todoId: number, newTitle: string) => void,
  todoCompleteUpdate: (todoId: number, newCompleted: boolean) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  todoCompleteUpdate,
  onTodoEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number>();

  const handleNewTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value.trim());
  };

  const handleEditStart = (newTodo: Todo) => {
    setIsEditing(true);
    setEditedTitle(newTodo.title);
    setSelectedTodoId(newTodo.id);
  };

  const handleEditEnd = () => {
    setIsEditing(false);

    if (editedTitle.trim() && selectedTodoId) {
      onTodoEdit(selectedTodoId, editedTitle);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (editedTitle) {
        handleEditEnd();
      } else {
        deleteTodo(todo.id);
      }
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => todoCompleteUpdate(todo.id, !todo.completed)}
        />
      </label>
      {isEditing ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={handleNewTodoTitle}
            onBlur={handleEditEnd}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => handleEditStart(todo)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
