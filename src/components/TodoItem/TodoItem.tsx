/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { deleteTodo, updateTodo } from '../../api/todos';
import { useState } from 'react';

interface Props {
  todo: Todo;
  isTemp: boolean;
  deleteIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  setDeleteIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  deleteIds,
  setTodos,
  setError,
  setDeleteIds,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [editValue, setEditValue] = useState('');

  const handleDeleteTodo = (todoId: number) => {
    setDeleteIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(todoItem => todoItem.id !== todoId),
        ),
      )
      .catch(() => {
        setError(Error.UnableDelete);
      })
      .finally(() => {
        setDeleteIds(prevIds => prevIds.filter(id => id !== todoId));
      });
  };

  const handleToggleTodo = (todo_: Todo) => {
    setIsLoading(true);

    const updatedTodo = { ...todo_, completed: !todo_.completed };

    updateTodo(todo_.id, { completed: !todo_.completed })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(item => (item.id === todo_.id ? updatedTodo : item)),
        );
      })
      .catch(() => setError(Error.UnableEdit))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(newTitle);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
  };

  const handleSaveEdit = () => {
    const normTitle = editValue.trim();

    if (!!normTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (normTitle !== todo.title) {
      updateTodo(todo.id, { title: normTitle })
        .then(res => {
          setTodos(prevTodos =>
            prevTodos.map(item => (item.id === todo.id ? res : item)),
          );
          setNewTitle(res.title);
          setIsEditing(false);
        })
        .catch(() => setError(Error.UnableEdit))
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsLoading(true);
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyUp={handleKeyPress}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEdit}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isTemp || deleteIds.includes(todo.id) || isLoading) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
