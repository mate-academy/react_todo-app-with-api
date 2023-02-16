import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  toggleTodo: (todo: Todo) => void;
  updatingTodos: number[];
  updateTodo: (todo: Todo) => void;
};

export const TodoContent:React.FC<Props> = ({
  todo,
  deleteTodo,
  toggleTodo,
  updatingTodos,
  updateTodo,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title || '');
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const formUpdateTodoSubmit = (chosenTodo: Todo) => {
    if (!editedTitle) {
      deleteTodo(chosenTodo.id);
    }

    updateTodo({
      ...chosenTodo,
      title: editedTitle,
    });

    setIsBeingEdited(false);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            toggleTodo(todo);
          }}
        />
      </label>

      {isBeingEdited ? (
        <form onSubmit={(event) => {
          event.preventDefault();
          formUpdateTodoSubmit(todo);
        }}
        >
          <input
            type="text"
            placeholder="Empty title will be deleted"
            className="todo__title-field"
            value={editedTitle}
            onBlur={() => formUpdateTodoSubmit(todo)}
            onChange={(event) => {
              setEditedTitle(event.target.value);
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsBeingEdited(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              if (deleteTodo) {
                deleteTodo(todo.id);
              }
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': updatingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>

  );
};
