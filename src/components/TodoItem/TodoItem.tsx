import React, {
  useContext, useState, useRef, useEffect,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../TodoContext';
import { Loading } from '../Loading';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    deleteTodo, loading, updateTodo, isLoadingAll,
  } = useContext(TodoContext);
  const { title, completed, id } = { ...todo };
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleChangeStatus = () => {
    const updatedTodo = {
      ...todo,
      completed: !completed,
    };

    return updateTodo(updatedTodo);
  };

  const handleEditTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(false);

    if (editedTodo === title) {
      return;
    }

    if (editedTodo.trim().length) {
      const updatedTodo = {
        ...todo,
        title: editedTodo,
      };

      updateTodo(updatedTodo);
    } else {
      deleteTodo(id);
    }
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setIsEditing(true);
  };

  const handleEscapeAction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTodo(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditTodo} onBlur={handleEditTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTodo}
            onChange={(event) => setEditedTodo(event.target.value)}
            onKeyUp={handleEscapeAction}
            ref={inputRef}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {editedTodo}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>
      {(loading === id || isLoadingAll) && <Loading />}
    </div>
  );
};
