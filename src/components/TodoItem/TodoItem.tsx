/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { UpdateTodo } from '../../types/UpdateTodo';
import { useTodoItem } from '../../hooks/useTodoItem';

interface TodoProps {
  todo: Todo;
  isUpdatingTodo: boolean;
  deletedTodoId: Todo['id'];
  toggledTodoId: Todo['id'];
  updateTitle: string;
  onChangeDeletedTodoId: (deletedTodoId: Todo['id']) => void;
  onDeleteTodo: (todoId: Todo['id']) => void;
  onChangeTodo: ({ id, title, completed }: UpdateTodo) => Promise<void>;
  onToggledTodoId: (toggledTodoId: Todo['id']) => void;
  onUpdateTitle: (updateTitle: string) => void;
}

export const TodoItem: React.FC<TodoProps> = ({
  todo,
  isUpdatingTodo,
  deletedTodoId,
  toggledTodoId,
  updateTitle,
  onChangeDeletedTodoId,
  onDeleteTodo,
  onChangeTodo,
  onToggledTodoId,
  onUpdateTitle,
}) => {
  const {
    isVisibleFormForChange,
    setIsVisibleFormForChange,
    inputRef,
    handleChangeTitle,
    handleOnDelete,
    handleOnBlur,
    handleOnKeyUp,
    handleClickCheckbox,
  } = useTodoItem({
    todo,
    updateTitle,
    onChangeDeletedTodoId,
    onDeleteTodo,
    onChangeTodo,
    onToggledTodoId,
    onUpdateTitle,
  });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
          onClick={handleClickCheckbox}
        />
      </label>

      {!isVisibleFormForChange ? (
        <form onSubmit={handleChangeTitle} method="PATCH">
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            onBlur={handleOnBlur}
            placeholder="Empty todo will be deleted"
            value={updateTitle}
            onChange={event => onUpdateTitle(event.target.value)}
            onKeyUp={handleOnKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsVisibleFormForChange(false);
              onUpdateTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleOnDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo.id === 0 ||
            todo.id === deletedTodoId ||
            toggledTodoId === todo.id ||
            isUpdatingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
