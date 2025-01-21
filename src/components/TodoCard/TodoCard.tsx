/* eslint-disable prettier/prettier */
import cn from 'classnames';
import { updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { useState } from 'react';



interface Props {
  isDeleting: boolean;
  setTodos: (todos: Todo[]) => void;
  setHasError: (hasError: Errors) => void;
  initialTodos: Todo[];
  isUpdating: boolean;
  setIsUpdating: (isUpdating: boolean) => void;
  updatingTodoId: number | null;
  setUpdatingTodoId: (updatingTodoId: number | null) => void;
  toggleCompleteAll: boolean;
  handleDelete: (todoId: number) => void;
  deletingCardId: number | null;
  CurrentTodo: Todo;
  handleComplete: (todo: Todo) => void;
}

/* eslint-disable jsx-a11y/label-has-associated-control */
export const TodoCard: React.FC<Props> = props => {
  const {
    isDeleting,
    setTodos,
    setHasError,
    initialTodos,
    isUpdating,
    setIsUpdating,
    updatingTodoId,
    setUpdatingTodoId,
    toggleCompleteAll,
    handleDelete,
    deletingCardId,
    CurrentTodo,
    handleComplete,
  } = props;


  const [isEditStatus, setIsEditStatus] = useState(false);
  const [editTitleQuery, setEditTitleQuery] = useState(CurrentTodo.title);
  const [isUpdateRunning, setIsUpdateRunning] = useState(false);





  const handleEditUpdate =  async (
    event:
    | React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement, Element>
    | React.KeyboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    if( isUpdateRunning) {
      return;
    }

    setIsUpdateRunning(true);

    setIsUpdating(true);
    setUpdatingTodoId(CurrentTodo.id);



    if(!editTitleQuery.trim()) {
      await handleDelete(CurrentTodo.id);
      setIsUpdating(false);
      setIsUpdateRunning(false);

      return;
    }

    if (editTitleQuery === CurrentTodo.title) {
      setIsUpdating(false);
      setIsEditStatus(false);
      setIsUpdateRunning(false);

      return;
    }

    try {


      const todoToUpdate = {
        title: editTitleQuery.trim(),
        completed: CurrentTodo.completed,
        userId: CurrentTodo.userId,
      };

      await updateTodo( CurrentTodo.id, todoToUpdate);

      setIsUpdating(false);
      setUpdatingTodoId(null);
      setTodos(initialTodos.map(todo =>
        (todo.id === CurrentTodo.id ? { ...todoToUpdate, id: todo.id }
          : todo)));
      setIsEditStatus(false);
      setIsUpdateRunning(false);


    } catch {

      setHasError(Errors.UnableToUpdate);
      setIsUpdating(false);
      setUpdatingTodoId(null);
      setIsUpdateRunning(false);
    }
  };

  const handleEscapeButton =
    (event: React.KeyboardEvent<HTMLInputElement>) => {

      if (event.key === 'Escape') {
        setIsEditStatus(false);
        setEditTitleQuery(CurrentTodo.title);
      }
    };

  const handleOnblur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!isUpdateRunning) {
      handleEditUpdate(event);
      setIsEditStatus(false);
    }

    return;
  };

  const isLoaderVisible = (isDeleting && deletingCardId === CurrentTodo.id) ||
  (isUpdating && updatingTodoId === CurrentTodo.id) ||
  toggleCompleteAll;

  return (
    <div data-cy="Todo" className={cn('todo',
      { completed: CurrentTodo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={CurrentTodo.completed}
          onChange={() => handleComplete(CurrentTodo)}
        />
      </label>

      {isEditStatus && (
        <form onSubmit={handleEditUpdate}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitleQuery}
            onChange={event => setEditTitleQuery(event.target.value)}
            autoFocus
            onBlur={handleOnblur}
            onKeyDown={handleEscapeButton}

          />
        </form>
      )}

      {!isEditStatus && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditStatus(true);
            }}
          >
            {CurrentTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(CurrentTodo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoaderVisible
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
