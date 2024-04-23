/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useContext, useEffect, useRef, useState } from 'react';
import { TodosContext } from '../TodosProvider/TodosProvider';
import { updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { handleComplete, isCompleted, handleDelete, loadingIds, setTodos } =
    useContext(TodosContext);
  const [editForm, setEditForm] = useState<Todo | null>(null);
  const [title, setTitle] = useState(todo.title);
  const focus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus.current) {
      focus.current.focus();
    }
  }, [editForm]);

  const updateData = () => {
    const updatedTitle = {
      ...todo,
      title,
    };

    updateTodo(updatedTitle).then(() => {
      setTodos(prevTodo =>
        prevTodo.map(item => (item.id === todo.id ? updateData : item)),
      );
    });
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditForm(null);
    } else if (e.key === 'Enter') {
      setEditForm(null);
    }
  };

  const handleOnBlur = () => {
    setEditForm(null);
  };

  return (
    <div
      onDoubleClick={() => setEditForm(todo)}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status "
          checked={isCompleted ? isCompleted : todo.completed}
          onChange={() => handleComplete(todo, !todo.completed)}
        />
      </label>

      {editForm?.id !== todo.id ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDelete(todo.id);
            }}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            ref={focus}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyUp={onKeyUp}
            onBlur={handleOnBlur}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
