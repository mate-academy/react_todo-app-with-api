import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as api from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';
import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';
import { Errors } from '../../types/Errors';

interface Props {
  todoItem: Todo,
}

export const TodoItem: React.FC<Props> = ({ todoItem }) => {
  const { id, title, completed } = todoItem;
  const {
    errorMessage,
    setErrorMessage,
    setTodos,
    setLoadingIds,
  } = useContext(TodosContext);
  const {
    deleteTodo,
    toggleTodo,
    // editTodo,
  } = useContext(TodoUpdateContext);

  const [loading, setLoading] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, [isEditing, errorMessage]);

  const handleDelete = async () => {
    try {
      await deleteTodo(id);
    } catch (error) {
      setErrorMessage(Errors.Delete);
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

  const saveEditing = () => {
    if (!editTitle.trim()) {
      deleteTodo(id);
    }

    if (editTitle.trim()) {
      if (editTitle === title) {
        setIsEditing(false);
      } else {
        setLoadingIds(currentTodos => [...currentTodos, id]);

        api.editTodo({ completed, id, title: editTitle })
          .then(() => {
            setTodos(currentTodos => currentTodos
              .map(currentTodo => (currentTodo.id === id
                ? ({ ...currentTodo, title: editTitle.trim() })
                : currentTodo)));
            setIsEditing(false);
          })
          .catch(() => setErrorMessage(Errors.Update))
          .finally(() => setLoadingIds([]));
      }
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
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleField}
            onBlur={saveEditing}
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
          {editTitle.trim()}
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
