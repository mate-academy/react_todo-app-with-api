/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  deleteTodo?: (todoId: number) => void;
  toggleTodoStatus?: (todoId: number) => Promise<void>;
  updateTodoTitle?: (todoId: number, newTitle: string) => Promise<void>;
  isAllLoading?: boolean | undefined;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  deleteTodo = () => {},
  toggleTodoStatus = () => {},
  updateTodoTitle = () => {},
  isAllLoading,
}) => {
  const { id, title, completed } = todo;
  const [isActiveLoader, setisActiveLoader] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(0);
  const [editingTitle, setEditingTitle] = useState('');

  const handleDelete = async () => {
    setisActiveLoader(true);
    try {
      await deleteTodo?.(id);
    } finally {
      setisActiveLoader(false);
    }
  };

  const handleTodoStatus = async () => {
    setisActiveLoader(true);
    try {
      await toggleTodoStatus?.(todo.id);
    } finally {
      setisActiveLoader(false);
    }
  };

  const handleDoubleClick = (editedTodo: Todo) => {
    setIsEdit(true);
    setEditingTodoId(editedTodo.id);
    setEditingTitle(editedTodo.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateTodoTitle(editingTodoId, editingTitle).finally(() => {
        setEditingTodoId(0);
        setEditingTitle('');
        setIsEdit(false);
      });
    } else if (e.key === 'Escape') {
      setEditingTodoId(0);
      setEditingTitle('');
      setIsEdit(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={completed && !isEdit ? 'todo completed' : 'todo'}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleTodoStatus}
        />
      </label>
      {isEdit ? (
        <input
          type="text"
          className="todo__title-field"
          value={editingTitle}
          onChange={e => setEditingTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEdit(false)}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader
        isActiveLoader={todo.id === 0 || isAllLoading || isActiveLoader}
      />
    </div>
  );
};
