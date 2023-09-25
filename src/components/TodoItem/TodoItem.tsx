import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useContext,
} from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { LoadingTodosContext } from '../../context/TodosContexts';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  onChangeTitle: (todoId: number, newTitle: string) => void;
  onChangeCompletedStatus: (todoId: number, isCompleted: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onChangeTitle,
  onChangeCompletedStatus,
}) => {
  const {
    todosIdToDelete,
    todosIdToUpdate,
  } = useContext(LoadingTodosContext);
  const { title, completed, id } = todo;

  const editInput = useRef<HTMLInputElement>(null);

  const [editingTitle, setEditingTitle] = useState(title);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (editInput.current) {
      editInput.current.focus();
    }
  }, [isEdit]);

  const isActiveLoader = useMemo(() => {
    return id === 0
      || todosIdToDelete.includes(id)
      || todosIdToUpdate.includes(id);
  }, [todosIdToDelete, todosIdToUpdate]);

  const handleEditing = () => {
    setIsEdit(true);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
  };

  const saveChange = () => {
    if (!editingTitle.trim()) {
      onDeleteTodo(id);
    } else if (editingTitle !== title) {
      onChangeTitle(id, editingTitle);
    }

    setIsEdit(false);
  };

  const handleEditingKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
      setEditingTitle(title);
    }

    if (event.key === 'Enter') {
      saveChange();
    }
  };

  const handleEditingBlur = () => {
    if (isEdit) {
      saveChange();
    }
  };

  return (
    <div
      className={classnames('todo', {
        completed,
        editing: isEdit,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onChangeCompletedStatus(id, completed)}
          checked={completed}
        />
      </label>

      {isEdit ? (
        <form
          onSubmit={
            (event: React.FormEvent<HTMLFormElement>) => event.preventDefault()
          }
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={handleChangeTitle}
            onKeyUp={handleEditingKeyUp}
            onBlur={handleEditingBlur}
            ref={editInput}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={handleEditing}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>

          <button
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classnames('modal', 'overlay', {
          'is-active': isActiveLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
