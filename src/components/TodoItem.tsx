import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { useState } from 'react';
import { EditForm } from './EditForm';

interface Props {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  updtTodo: (id: number, data: Partial<Todo>) => Promise<Todo>;
  loadingTodosIds: number[];
  setLoadingTodosIds: (todos: number[]) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updtTodo,
  loadingTodosIds,
  setLoadingTodosIds,
}) => {
  const { title, completed } = todo;
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  const handleDeleteTodo = (id: number) => {
    setLoadingTodosIds([...loadingTodosIds, todo.id]);

    deleteTodo(id).finally(() =>
      setLoadingTodosIds(loadingTodosIds.filter(ids => ids !== todo.id)),
    );
  };

  const handleChangeCheckbox = () => {
    setLoadingTodosIds([...loadingTodosIds, todo.id]);

    const changeValue = {
      completed: !completed,
    };

    updtTodo(todo.id, changeValue).finally(() =>
      setLoadingTodosIds(loadingTodosIds.filter(ids => ids !== todo.id)),
    );
  };

  const isTodoLoading = loadingTodosIds.includes(todo.id);

  const handleOnDoubleClick = () => {
    setEditTodo(todo);
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
          onChange={handleChangeCheckbox}
          checked={completed}
        />
      </label>

      {editTodo ? (
        <EditForm
          editTodo={editTodo}
          loadingTodosIds={loadingTodosIds}
          updtTodo={updtTodo}
          setEditTodo={setEditTodo}
          setLoadingTodosIds={setLoadingTodosIds}
          deleteTodo={deleteTodo}
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
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {isTodoLoading && <Loader isLoading={isTodoLoading} />}
    </div>
  );
};
