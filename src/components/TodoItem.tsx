/* eslint-disable no-lone-blocks */
import classNames from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodosContext } from './Todos.Context';
import { updateTodos } from '../api/todos';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  // eslint-disable-next-line max-len, prettier/prettier
  const { todos, setTodos, removeTodo, editTodo, loading, setLoading, setError } = useContext(TodosContext);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const [handleDeleteTodoId, setHandleDeleteTodoId] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, todo]);

  useEffect(() => {
    const todoInput = document.getElementById('todoInput');

    if ((handleDeleteTodoId || todo) && todoInput) {
      todoInput.focus();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDeleteTodoId]);

  const handleToggleCompleted = () => {
    const { id, userId, title, completed } = todo;

    setLoading(prevLoading => ({
      ...prevLoading,
      [id]: true,
    }));

    updateTodos({ id, userId, title, completed: !completed })
      .then(updatedTodo => {
        setTodos(
          todos.map(upTodo => {
            if (upTodo.id === updatedTodo.id) {
              return { ...updatedTodo };
            }

            return upTodo;
          }),
        );
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('Unable to update a todo', err);
        setError('Unable to update a todo');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setLoading(prevLoading => ({
          ...prevLoading,
          [id]: false,
        }));
      });
  };

  const handleEditTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleRemoveTodo = () => {
    removeTodo(todo.id);
    setHandleDeleteTodoId(todo.id);
  };

  const handleSave = () => {
    if (editedTitle.trim().length === 0) {
      removeTodo(todo.id);
    } else if (editedTitle.trim() !== todo.title) {
      const todoNew = {
        id: todo.id,
        userId: todo.userId,
        title: editedTitle,
        completed: todo.completed,
      };

      editTodo(todoNew.id, todoNew.userId, todoNew.title, todoNew.completed);
    }

    setIsEditing(false);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleCompleted}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={handleEditTodo}
            onBlur={handleSave}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {editedTitle}
          </span>

          {/* Remove button appears only on hover */}

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemoveTodo}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo.id === 0 || handleDeleteTodoId === todo.id || loading[todo.id],
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
