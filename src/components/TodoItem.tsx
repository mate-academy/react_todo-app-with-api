import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  handleTodoStatus: (todoId: number, completed: boolean) => void,
  isEditing: number | null,
  editingHandler: (id: number) => void,
  editingTitle: string,
  setEditingTitle: (title: string) => void,
  cancelEdit: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  setIsEditing: (id: number) => void,
  deleteTodo: (id: number) => void,
  isInProcces: number[],
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({
  handleTodoStatus,
  isEditing,
  editingHandler,
  editingTitle,
  setEditingTitle,
  cancelEdit,
  setIsEditing,
  deleteTodo,
  isInProcces,
  todo,
}) => {
  const doubleClickHendler = () => {
    setIsEditing(todo.id);
    setEditingTitle(todo.title);
  };

  const handleEditingTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
  };

  const saveEditHandler = () => {
    editingHandler(todo.id);
  };

  const handleDeleteTodo = () => {
    deleteTodo(todo.id);
  };

  const editor = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle) {
      editor.current?.focus();
    }
  }, [editingTitle, todo.id]);

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => handleTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      {isEditing === todo.id
        ? (
          <form onSubmit={saveEditHandler}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editingTitle}
              onChange={handleEditingTitle}
              onBlur={saveEditHandler}
              onKeyUp={cancelEdit}
              ref={editor}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={doubleClickHendler}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': isInProcces.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
