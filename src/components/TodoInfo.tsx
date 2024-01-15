import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useTodo } from '../providers/TodoProvider';
import { TodoEdit } from './TodoEdit';

type Props = {
  todo: Todo
};

export const TodoInfo: FC<Props> = ({ todo }) => {
  const {
    updateTodo,
    modifiedTodo,
    setModifiedTodo,
    deleteTodoFromApi,
    isDeleting,
    isUpdating,
    tempTodo,
  } = useTodo();

  const handleDoubleClick = (todoId: number | null = null) => () => {
    setModifiedTodo(todoId);
  };

  const handleCheck = (checkedTodo: Todo) => () => {
    updateTodo(checkedTodo.id, { completed: !checkedTodo.completed });
  };

  const handleDelete = (todoId: number) => () => {
    deleteTodoFromApi(todoId);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={handleDoubleClick(todo.id)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheck(todo)}
        />
      </label>

      {todo.id !== modifiedTodo
        ? (
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
        )
        : <TodoEdit todo={todo} />}
      {todo.id !== modifiedTodo && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete(todo.id)}
        >
          ×
        </button>
      ) }

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting.includes(todo.id)
                  || isUpdating.includes(todo.id)
                  || todo.id === tempTodo?.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
