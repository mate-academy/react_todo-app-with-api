import classNames from 'classnames';
import { useRef, useState } from 'react';
import { Todo } from '../../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onChangeTodoStatus: (todo: Todo) => void;
  onTodoTitleChange: (todoId: number, newTitle: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onChangeTodoStatus,
  onTodoTitleChange,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const newTodoTitle = useRef<HTMLInputElement>(null);

  const handleDeleteTodo = () => {
    if (todo) {
      onDelete(todo.id);
    }
  };

  const handleStatusChange = () => {
    if (todo) {
      onChangeTodoStatus(todo);
    }
  };

  const handleTitleChange = () => {
    if (newTitle.trim().length === 0) {
      onDelete(todo.id);
    }

    if (newTitle === todo.title) {
      return;
    }

    onTodoTitleChange(todo.id, newTitle);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>

      {isInputActive ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={newTodoTitle}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => {
              setNewTitle(event.target.value);
            }}
            onBlur={() => handleTitleChange()}
            onKeyDown={event => {
              switch (event.key) {
                case 'Escape':
                  setIsInputActive(false);
                  setNewTitle(todo.title);
                  break;

                case 'Enter':
                  handleTitleChange();
                  setIsInputActive(false);
                  break;

                default:
                  break;
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setNewTitle(todo.title);
              setIsInputActive(true);
              setTimeout(() => {
                newTodoTitle.current?.focus();
              }, 0);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todo.isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
