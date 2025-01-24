/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  removeTodo,
  setEditingId,
  setLoadingTodos,
  updateTodoCheckStatus,
  editTodoBody,
  handleErrorNotification,
} from '../../features/todosSlice';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [newTitle, setNewTitle] = useState(todo.title);
  const isSubmitting = useAppSelector(state => state.todos.isSubmitting);
  const editingId = useAppSelector(state => state.todos.editingId);
  const updatingId = useAppSelector(state => state.todos.updatingId);
  const loadingTodos = useAppSelector(state => state.todos.loadingTodos);

  const { id, completed, title } = todo;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isEditing = id === editingId;

  const updateTodo = (updatedTodo: Todo) => {
    if (updatedTodo.title) {
      dispatch(editTodoBody(updatedTodo));
      setTimeout(() => dispatch(handleErrorNotification('')), 3000);
    } else {
      dispatch(setLoadingTodos(updatedTodo.id));
      dispatch(removeTodo(updatedTodo));
      setTimeout(() => dispatch(handleErrorNotification('')), 3000);
    }
  };

  const handleRemoveButton = (removedTodo: Todo) => {
    dispatch(removeTodo(removedTodo));
    setTimeout(() => dispatch(handleErrorNotification('')), 3000);

    dispatch(setLoadingTodos(removedTodo.id));
  };

  const handleDoubleClick = (editedTodo: Todo) => {
    dispatch(setEditingId(editedTodo.id));
  };

  const updateTitle = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      dispatch(setEditingId(undefined));

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
      dispatch(setEditingId(undefined));
      setNewTitle(title);
    }
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTodoCheckStatus({ ...todo, completed: e.target.checked }));
    setTimeout(() => dispatch(handleErrorNotification('')), 3000);
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
