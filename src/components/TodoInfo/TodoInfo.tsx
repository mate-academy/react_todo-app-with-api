import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (todoDelete: Todo) => void,
  handleUpdateTodoStatus:(todo: Todo) => void
  updatingTodoId: number
  handleUpdateTodoName:(todo: Todo, newName: string) => void
  loadingForToggle: boolean
};

export const TodoInfo: React.FC<Props> = (
  {
    todo,
    handleDeleteTodo,
    handleUpdateTodoStatus,
    updatingTodoId,
    handleUpdateTodoName,
    loadingForToggle,
  },
) => {
  const [newName, setNewName] = useState(todo.title);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [disableTodo, setDisabletodo] = useState(false);

  const handleNameChange = () => {
    if (!newName.trim()) {
      handleDeleteTodo(todo);

      return;
    }

    if (newName === todo.title) {
      setIsFormVisible(false);
      setNewName(todo.title);
    }

    if (newName !== todo.title) {
      handleUpdateTodoName(todo, newName);
      setIsFormVisible(false);
    }
  };

  const cancelNameChange = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFormVisible(false);
      setNewName(todo.title);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleNameChange();
    // eslint-disable-next-line no-console
    console.log(newName);
  };

  return (
    <div className={classNames(
      'todo',
      { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => handleUpdateTodoStatus(todo)}
        />
      </label>

      {isFormVisible
        ? (
          <form onSubmit={(event) => handleFormSubmit(event)}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onBlur={handleNameChange}
              onKeyDown={cancelNameChange}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsFormVisible(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                handleDeleteTodo(todo);
                setDisabletodo(true);
              }}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        {
          'is-active': updatingTodoId === todo.id
           || disableTodo || loadingForToggle,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
