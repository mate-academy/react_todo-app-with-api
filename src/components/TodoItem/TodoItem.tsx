import classNames from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { DispatchContext } from '../../context/TodosContext';
import { Errors } from '../../types/Errors';

type Props = {
  todo: Todo;
  handleDelete: (deletedPostId: number) => void;
  selectedTodo: number[];
  setSelectedTodo: React.Dispatch<React.SetStateAction<number[]>>;
  handleError: (message: Errors) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDelete,
  selectedTodo,
  setSelectedTodo,
  handleError,
}) => {
  const { id, completed, title } = todo;

  const dispatch = useContext(DispatchContext);

  const [newTitle, setNewTitle] = useState<string>(title);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const titleEditInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleEditInput.current) {
      titleEditInput.current.focus();
    }
  }, [isEdit]);

  const handleStatus = (updatingTodo: Todo) => {
    setSelectedTodo(prev => [...prev, id]);

    updateTodo(updatingTodo.id, { completed: !updatingTodo.completed })
      .then(() => {
        dispatch({ type: 'toggleStatus', payload: updatingTodo.id });
      })
      .catch(() => handleError(Errors.update))
      .finally(() => setSelectedTodo(prev => prev.filter(n => n !== id)));
  };

  const handleEdit = () => {
    if (newTitle.trim() === '') {
      setSelectedTodo(prev => [...prev, id]);

      deleteTodo(id)
        .then(() => {
          dispatch({ type: 'deleteTodo', payload: id });
          setIsEdit(false);
        })
        .catch(() => {
          handleError(Errors.delete);
          titleEditInput.current?.focus();
        })
        .finally(() => setSelectedTodo(prev => prev.filter(n => n !== id)));
    }

    if (title !== newTitle) {
      setSelectedTodo(prev => [...prev, id]);

      updateTodo(id, { title: newTitle })
        .then(() => {
          dispatch({
            type: 'updateTodo',
            payload: { ...todo, title: newTitle.trim() },
          });
          setIsEdit(false);
        })
        .catch(() => {
          handleError(Errors.update);
          titleEditInput.current?.focus();
        })
        .finally(() => {
          setSelectedTodo(prev => prev.filter(n => n !== id));
        });
    }

    if (title === newTitle) {
      setIsEdit(false);
    }
  };

  const handleEditKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEdit(false);
    }

    if (e.key === 'Enter' && title === newTitle) {
      setIsEdit(false);
    }

    if (e.key === 'Enter') {
      handleEdit();
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      key={id}
      onDoubleClick={() => setIsEdit(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleStatus(todo)}
        />
      </label>

      {isEdit && (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyUp={handleEditKeyUp}
            onBlur={() => handleEdit()}
            ref={titleEditInput}
          />
        </form>
      )}

      {!isEdit && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': selectedTodo.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
