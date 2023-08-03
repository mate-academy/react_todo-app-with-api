import cn from 'classnames';
import { useContext, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodoContext } from '../TodoContext/TodoContext';

interface Props{
  todo: Todo,
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setError, setTodos, loading, setLoading,
  } = useContext(TodoContext);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = (todoId: number) => {
    setLoading([todoId]);

    deleteTodo(todoId)
      .then(response => {
        if (response) {
          setTodos(currentTodos => (
            currentTodos.filter(currTodo => currTodo.id !== todoId)
          ));
        }
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setLoading([]));
  };

  const handleToggle = (todoId: number) => {
    setLoading([todoId]);

    updateTodo(todoId, { completed: !todo.completed })
      .catch(() => setError('Unable to update a todo'))
      .then(response => {
        if (response) {
          setTodos(currentTodos => {
            return currentTodos.map(currTodo => {
              return currTodo.id === todoId
                ? { ...currTodo, completed: !currTodo.completed }
                : currTodo;
            });
          });
        }

        setLoading([]);
      });
  };

  const handleSave = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditing(false);

      return;
    }

    if (trimmedTitle.length === 0) {
      handleDelete(todo.id);
      setEditing(false);

      return;
    }

    setLoading([todo.id]);

    updateTodo(todo.id, { title: newTitle })
      .catch(() => setError('Unable to update a todo'))
      .then(response => {
        if (response) {
          setTodos(currentTodos => {
            return currentTodos.map(currTodo => {
              return currTodo.id === todo.id
                ? { ...currTodo, title: newTitle }
                : currTodo;
            });
          });
        }

        setLoading([]);
        setEditing(false);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    event.preventDefault();

    if (event.key === 'Escape') {
      setEditing(false);
    }

    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={() => {
        setEditing(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => handleToggle(todo.id)}
        />
      </label>

      {!editing
        ? (
          <>
            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>
          </>
        ) : (
          <form>
            <input
              ref={inputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onKeyUp={handleKeyUp}
              onBlur={handleSave}
            />
          </form>
        )}

      <div className={cn('modal overlay',
        { 'is-active': loading.includes(todo.id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
