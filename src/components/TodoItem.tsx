import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { useState } from 'react';
import { EditForm } from './EditForm';

interface Props {
  todo: Todo;
  loadingTodosIds: number[];
  deleteTodo: (id: number) => Promise<void>;
  updtTodo: (id: number, data: Partial<Todo>) => Promise<Todo>;
  setLoadingTodosIds: (todos: number[]) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodosIds,
  deleteTodo,
  updtTodo,
  setLoadingTodosIds,
}) => {
  const { title, completed } = todo;
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  const handleChangeCheckbox = () => {
    setLoadingTodosIds([...loadingTodosIds, todo.id]);

    const changeValue = {
      completed: !completed,
    };

    updtTodo(todo.id, changeValue).finally(() =>
      setLoadingTodosIds(loadingTodosIds.filter(ids => ids !== todo.id)),
    );
  };

  const handleOnDoubleClick = () => {
    setEditTodo(todo);
  };

  const handleDeleteButton = () => {
    setLoadingTodosIds([...loadingTodosIds, todo.id]);

    deleteTodo(todo.id).finally(() =>
      setLoadingTodosIds(loadingTodosIds.filter(ids => ids !== todo.id)),
    );
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={handleOnDoubleClick}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          id="todoCheckbox"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeCheckbox}
        />
      </label>

      {editTodo ? (
        <EditForm
          editTodo={editTodo}
          loadingTodosIds={loadingTodosIds}
          updtTodo={updtTodo}
          deleteTodo={deleteTodo}
          setEditTodo={setEditTodo}
          setLoadingTodosIds={setLoadingTodosIds}
          todo={todo}
        />
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteButton}
          >
            ×
          </button>
        </>
      )}

      {loadingTodosIds && (
        <Loader loadingTodosIds={loadingTodosIds} todo={todo} />
      )}
    </div>
  );
};
