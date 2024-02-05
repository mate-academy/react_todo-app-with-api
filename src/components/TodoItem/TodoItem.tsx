import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';
import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';

interface Props {
  todoItem: Todo,
}

export const TodoItem: React.FC<Props> = ({ todoItem }) => {
  const { id, title, completed } = todoItem;
  const {
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);
  const {
    deleteTodo,
    toggleTodo,
    editTodo,
  } = useContext(TodoUpdateContext);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleDelete = async () => {
    try {
      await deleteTodo(id);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const handleCheckbox = async () => {
    try {
      setLoading(true);

      const updatedTodo = { ...todoItem, completed: !completed };

      await toggleTodo(updatedTodo);
    } finally {
      setLoading(false);
    }
  };

  const saveEditing = async () => {
    if (!editTitle.trim()) {
      try {
        await deleteTodo(id);
      } catch (error) {
        setErrorMessage('Unable to delete a todo');
      }
    }

    if (editTitle.trim()) {
      setIsEditing(false);
      editTodo(id, editTitle);
    }
  };

  const handleOnEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveEditing();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(title);
    }
  };

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing, errorMessage]);

  return (
    <div
      data-cy="Todo"
      className={
        classNames('todo', {
          completed,
        })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', {
            completed,
          })}
          checked={completed}
          onChange={handleCheckbox}
          disabled={loading}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            ref={titleField}
            onBlur={saveEditing}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleOnEditing}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <TodoLoader id={id} />
    </div>
  );
};
