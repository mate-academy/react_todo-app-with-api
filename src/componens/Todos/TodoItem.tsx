import classNames from 'classnames';
import { useState } from 'react';
import { useAppSelector } from '../../app/hook';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  deleteTodo(id: number): void;
  statusResponse: number | null
  updateTodo: (id: number, completed: boolean, title: string) => void
  changeAll: boolean
};

export const TodoItem: React.FC<Props> = (
  {
    todo,
    deleteTodo,
    statusResponse,
    updateTodo,
    changeAll,
  },
) => {
  const [isEding, setIsEding] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const statusAllChange = useAppSelector(state => state.status.statusAllChange);
  const deleteCompleted = useAppSelector(
    state => state.status.allDeleteCompleted,
  );

  const isBlurInput = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle !== todo.title) {
      updateTodo(todo.id, todo.completed, newTitle);
      setIsEding(false);
    }

    if (!newTitle.trim()) {
      deleteTodo(todo.id);
    }

    setIsEding(false);
  };

  const keyUp = (event: { key: string }) => {
    switch (event.key) {
      case 'Enter':
        updateTodo(todo.id, todo.completed, newTitle);
        break;

      case 'Escape':
        setNewTitle(todo.title);
        setIsEding(false);
        break;

      default: break;
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', { completed: !!todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={!!todo.completed}
          onClick={() => updateTodo(todo.id, !todo.completed, todo.title)}
        />
      </label>

      {isEding ? (
        <form
          onSubmit={isBlurInput}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={(event) => setNewTitle(event.target.value)}
            value={newTitle}
            onBlur={isBlurInput}
            onKeyUp={keyUp}
          />
        </form>

      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEding(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>

      )}

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay',
            {
              'is-active': todo.id === 0
                || todo.id === statusResponse || changeAll || statusAllChange
                || (deleteCompleted && todo.completed),
            })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
