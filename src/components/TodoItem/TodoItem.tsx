import {
  useEffect,
  useRef,
  useState,
} from 'react';

import cn from 'classnames';
import * as todosAPI from '../../api/todos';
import { Todo } from '../../types/Todo';
import { useTodosState } from '../../contexts/TodosContext';
import { useErrorsState } from '../../contexts/ErrorsContext';

type Props = {
  todo: Todo;
  triggerInputFocus: () => void;
};

export const TodoItem: React.FC<Props> = ({ todo, triggerInputFocus }) => {
  const {
    id,
    completed,
    title,
  } = todo;
  const [, todosDispatch] = useTodosState();
  const [, setErrorMessage] = useErrorsState();

  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isChangingOnServer, setIsChangingOnServer] = useState(false);

  const editingInputRef = useRef<HTMLInputElement>(null);
  const isTempTodo = id === 0;

  useEffect(() => {
    editingInputRef?.current?.focus();
  }, [isEdited]);

  const updateTodo = (updatePart: Partial<Todo>) => {
    setIsChangingOnServer(true);
    setErrorMessage('');

    return todosAPI.updateTodo(id, updatePart)
      .then(updatedTodo => todosDispatch(
        { type: 'update', payload: updatedTodo },
      ))
      .catch(err => {
        setErrorMessage('Unable to update a todo');
        throw err;
      })
      .finally(() => setIsChangingOnServer(false));
  };

  const handleTodoStatusToggle = () => {
    updateTodo({ completed: !completed });
  };

  const handleTodoTitleEdit = (newTitle: string) => {
    return updateTodo({ title: newTitle });
  };

  const handleTodoDeleting = () => {
    setIsChangingOnServer(true);
    setErrorMessage('');

    return todosAPI.deleteTodo(id)
      .then(() => todosDispatch({ type: 'delete', payload: id }))
      .catch(err => {
        setErrorMessage('Unable to delete a todo');
        throw err;
      })
      .finally(() => setIsChangingOnServer(false));
  };

  const handleTodoDeletingByBtn = () => {
    handleTodoDeleting()
      .finally(triggerInputFocus);
  };

  const handleDoubleClick = () => {
    setErrorMessage('');
    setIsEdited(true);
  };

  const handleEditFormSubmit = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === title) {
      setIsEdited(false);
      setEditedTitle(trimmedTitle);

      return;
    }

    if (!trimmedTitle.length) {
      handleTodoDeleting()
        .catch(() => setEditedTitle(title));
    } else {
      handleTodoTitleEdit(trimmedTitle)
        .then(() => {
          setIsEdited(false);
          setEditedTitle(trimmedTitle);
        })
        .catch(() => setEditedTitle(title));
    }
  };

  const handleEditCancelling = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
      setEditedTitle(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoStatusToggle}
        />
      </label>

      {
        isEdited ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleEditFormSubmit();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={event => setEditedTitle(event.target.value)}
              onBlur={handleEditFormSubmit}
              onKeyUp={handleEditCancelling}
              ref={editingInputRef}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleTodoDeletingByBtn}
            >
              ×
            </button>
          </>
        )
      }

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTempTodo || isChangingOnServer,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
