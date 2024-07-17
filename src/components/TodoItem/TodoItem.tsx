/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useDispatch, useGlobalState } from '../../GlobalStateProvider';
import { Type } from '../../types/Action';
import { ErrorType } from '../../types/Errors';
import { updateTodos } from '../../api/todos';

type Props = {
  todo: Todo;
  deleteTodosFromServer: (a: Todo) => void;
  handleError: (message: string) => void;
  updateTodoCheckOnServer: (arg: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodosFromServer,
  handleError,
  updateTodoCheckOnServer,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const { editingId, isSubmitting, loadingTodos, updatingId } =
    useGlobalState();
  const dispatch = useDispatch();
  const { id, completed, title } = todo;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isEditing = id === editingId;

  const updateTodoOnServer = async (updatedTodo: Todo) => {
    dispatch({ type: Type.setErrorMessage, payload: '' });
    dispatch({ type: Type.setUpdatingId, payload: updatedTodo.id });

    try {
      const item = await updateTodos(updatedTodo);

      dispatch({ type: Type.UpdateTodo, payload: item });
      dispatch({ type: Type.setEditingId, payload: undefined });
    } catch {
      handleError(ErrorType.UPDATE_TODO);
      dispatch({ type: Type.setEditingId, payload: updatedTodo.id });
    } finally {
      dispatch({ type: Type.setUpdatingId, payload: undefined });
    }
  };

  const updateTodo = (updatedTodo: Todo) => {
    if (updatedTodo.title) {
      updateTodoOnServer(updatedTodo);
    } else {
      dispatch({ type: Type.setLoadingTodos, payload: updatedTodo.id });
      deleteTodosFromServer(updatedTodo);
    }
  };

  const handleRemoveButton = (removedTodo: Todo) => {
    deleteTodosFromServer(removedTodo);
    dispatch({ type: Type.setLoadingTodos, payload: removedTodo.id });
  };

  const handleDoubleClick = (editedTodo: Todo) => {
    dispatch({ type: Type.setEditingId, payload: editedTodo.id });
  };

  const updateTitle = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      dispatch({ type: Type.setEditingId, payload: undefined });

      return;
    }

    setNewTitle(trimmedTitle);
    updateTodo({ ...todo, title: trimmedTitle });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTitle();
  };

  const checkEsc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEsc = e.key === 'Escape' ? true : false;

    if (isEsc) {
      dispatch({ type: Type.setEditingId, payload: undefined });
      setNewTitle(title);
    }
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTodoCheckOnServer({ ...todo, completed: e.target.checked });
  };

  const handleNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const showLoader =
    todo.id === 0 || loadingTodos.includes(todo.id) || todo.id === updatingId;

  return (
    <div
      data-cy="Todo"
      className={
        'todo ' +
        (completed ? 'completed' : '') +
        (isSubmitting ? 'is-active' : '')
      }
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheck}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleNewTitle}
            onKeyUp={checkEsc}
            onBlur={updateTitle}
            ref={inputRef}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleRemoveButton(todo)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={'modal overlay ' + (showLoader ? 'is-active' : '')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
