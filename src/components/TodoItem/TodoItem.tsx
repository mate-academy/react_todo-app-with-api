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

  const isEditingRef = useRef(false);

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  const saveEditing = async () => {
    try {
      if (!editTitle.trim()) {
        if (isEditingRef.current) {
          await deleteTodo(todoItem.id);
        }
      } else {
        const updatedTodo = {
          ...todoItem,
          title: editTitle,
          id: todoItem.id,
        };

        setIsEditing(false);

        await editTodo(updatedTodo);
      }
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoading(false);
    }
  };

  const handleOnEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveEditing();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        <form onSubmit={handleSubmit}>
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
          {editTitle}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      <TodoLoader id={id} />
    </div>
  );
};
