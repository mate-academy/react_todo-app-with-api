/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useRef, useState } from 'react';
import { TodoItem } from '../TodoItem';

interface Props {
  tempTodo?: Todo;
  todos: Todo[];
  onDelete: (id: number) => void;
  deleting: number[];
  onCheck: (id: number, completed: boolean) => void;
  onEdit: (id: number, title: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleting,
  onDelete = () => {},
  onCheck = () => {},
  onEdit = () => {},
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [currentTodoTitle, setCurrentTodoTitle] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleEditing = ({ id, title }: Todo) => {
    setEditingTodoId(id);
    setNewTodoTitle(title);
    setCurrentTodoTitle(title);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSave = async () => {
    if (editingTodoId === null) {
      return;
    }

    const trimmedNewTitle = newTodoTitle.trim();
    const trimmedCurrentTitle = currentTodoTitle.trim();

    if (trimmedNewTitle.length === 0) {
      try {
        await onDelete(editingTodoId);
        setEditingTodoId(null);
      } catch (error) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }

    if (trimmedNewTitle === trimmedCurrentTitle) {
      setEditingTodoId(null);

      return;
    }

    if (trimmedNewTitle.length > 0) {
      try {
        await onEdit(editingTodoId, trimmedNewTitle);
        setEditingTodoId(null);
        setNewTodoTitle('');
      } catch (error) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    }

    if (event.key === 'Escape') {
      setEditingTodoId(null);
      setNewTodoTitle('');
    }
  };

  return (
    <>
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status checked"
              checked={todo.completed}
              onChange={() => onCheck(todo.id, !todo.completed)}
            />
          </label>
          {editingTodoId === todo.id ? (
            <input
              ref={inputRef}
              type="text"
              data-cy="TodoTitleField"
              className="todo__title-field"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              autoFocus
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
            ></input>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleEditing(todo)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(todo.id)} // here i cannot use destructuring because of onDelete and edditingTodoId
              >
                ×
              </button>
            </>
          )}
          {/* Only show loader for deleting todos */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': deleting.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && <TodoItem tempTodo={tempTodo} />}
    </>
  );
};
