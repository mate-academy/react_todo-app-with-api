/* eslint-disable max-len */
import classNames from 'classnames';
import { useState } from 'react';

import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  onTodosChange: React.Dispatch<React.SetStateAction<Todo[]>>,
  onErrorMesssageChange: (val: string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodosChange,
  onErrorMesssageChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleTodoTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const removeTodo = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => onTodosChange(currentTodos => currentTodos
        .filter(curTodo => curTodo.id !== todoId)))
      .catch(() => onErrorMesssageChange('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  const handleUpdate = (data: Partial<Todo>) => {
    setIsLoading(true);

    updateTodo(todo.id, data)
      .then((newTodo) => {
        onTodosChange(prevState => {
          return prevState.map(todoItem => {
            if (todoItem.id === newTodo.id) {
              return newTodo;
            }

            return todoItem;
          });
        });
        setIsEditing(false);
      })
      .catch(() => onErrorMesssageChange('Unable to update a todo'))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateStatus = () => {
    handleUpdate({ completed: !todo.completed });
  };

  const updateTitle = () => {
    if (editedTitle.trim() === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!editedTitle.trim().length) {
      removeTodo(todo.id);

      return;
    }

    handleUpdate({ title: editedTitle.trim() });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTitle();
  };

  const handlePressKeyout = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed === true,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleUpdateStatus}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={handleTodoTitleChange}
              onBlur={updateTitle}
              onKeyUp={handlePressKeyout}
              // eslint-disable-next-line
              autoFocus
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => removeTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
