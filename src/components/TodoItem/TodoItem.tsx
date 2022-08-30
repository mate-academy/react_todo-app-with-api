import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (v: number) => void;
  setTodos: (v: Todo[]) => void;
  changeStatusTodo: (v: number, v2: boolean) => void;
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    removeTodo,
    changeStatusTodo,
  } = props;

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
          onClick={() => changeStatusTodo(todo.id, todo.completed)}
        />
      </label>

      {/* {showInput
        ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={newTodoField}
              value={value}
              onChange={e => setName(e.target.value)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              onDoubleClick={props.handleDoubleClick}
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(todo.id)}
            >
              ×
            </button>
          </>
        )} */}

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={todo.isLoading
          ? 'modal overlay is-active'
          : 'modal overlay'}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
