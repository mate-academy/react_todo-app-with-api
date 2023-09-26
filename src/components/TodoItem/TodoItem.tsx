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
  onDeleteTodo: (todoId: number) => Promise<void>;
  onChangeTitle: (todoId: number, newTitle: string) => Promise<void>;
  onChangeCompletedStatus: (
    todoId: number,
    isCompleted: boolean,
  ) => Promise<void>;
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

  const editInputRef = useRef<HTMLInputElement>(null);

  const [editingTitle, setEditingTitle] = useState(title);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
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

  const handleChangeCompletedStatus = async () => {
    try {
      await onChangeCompletedStatus(id, completed);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleDeleteTodo = async () => {
    try {
      await onDeleteTodo(id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const saveChanges = async () => {
    try {
      const preparedTitle = editingTitle.trim();

      if (!preparedTitle) {
        await onDeleteTodo(id);
      }

      if (preparedTitle !== title) {
        await onChangeTitle(id, preparedTitle);
      }

      setEditingTitle(prevState => prevState.trim());
      setIsEdit(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleEditingKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
      setEditingTitle(title);
    }

    if (event.key === 'Enter') {
      saveChanges();
    }
  };

  const handleEditingBlur = () => {
    if (isEdit) {
      saveChanges();
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
          onChange={handleChangeCompletedStatus}
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
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={handleChangeTitle}
            onKeyUp={handleEditingKeyUp}
            onBlur={handleEditingBlur}
            ref={editInputRef}
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
            onClick={handleDeleteTodo}
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
