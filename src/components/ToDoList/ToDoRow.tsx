import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodoRow } from './useTodoRow';

type ToDoRowProps = {
  todo: Todo;
  isDisabled?: boolean;
  isEdited?:boolean;
  editTodo?: (todoId:number | null) => void;
};

export const ToDoRow = ({
  todo,
  isDisabled,
  isEdited = false,
  editTodo = () => {},
}: ToDoRowProps) => {
  const {
    isLoading,
    saveTodo,
    deleteTodo,
    editedTitle,
    setEditedTitle,
    handleEdit,
    inputRef,
  } = useTodoRow(todo, isEdited, editTodo);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => saveTodo({ ...todo, completed: !todo.completed })}
          readOnly
        />
      </label>
      {isEdited && (
        <form onSubmit={handleEdit} onBlur={handleEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            ref={inputRef}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyUp={key => {
              if (key.code === 'Escape') {
                setEditedTitle(todo.title);
                editTodo(null);
              }
            }}
          />
        </form>
      )}
      {!isEdited && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditedTitle(todo.title);
              editTodo(todo.id);
            }}
          >
            {editedTitle || todo.title}
          </span>
          {
            !isLoading(todo.id) && !isDisabled
            && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo)}
              >
                ×
              </button>
            )
          }
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading(todo.id) || isDisabled,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
