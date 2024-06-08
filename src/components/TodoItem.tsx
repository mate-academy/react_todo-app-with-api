/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useContext, useEffect, useRef, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { completedCheck, deletePost, titleChanged } from '../api/todos';
import { ErrorContext } from '../contexts/ErrorContext';
import { ActionType } from '../contexts/types/Actions';
import { LoadingContext } from '../contexts/LoadingContext';
import { DeletingContext } from '../contexts/DeletingContext';

export interface TodotodoType {
  todo: Todo;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoItem: React.FC<TodotodoType> = ({ todo, inputRef }) => {
  const { dispatch } = useContext(TodoContext);
  const { error, setError } = useContext(ErrorContext);
  const { loading } = useContext(LoadingContext);
  const { isDeleteActive } = useContext(DeletingContext);
  const [deletedId, setDeletedId] = useState(0);
  const [isEdited, setIsEdited] = useState(false);
  const [textEdited, setTextEdited] = useState<string | null>(null);

  const editForm = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { id, title, completed } = todo;

  useEffect(() => {
    if (editForm.current) {
      editForm.current.focus();
    }
  }, [textEdited]);

  const deleteTodo = () => {
    setDeletedId(id);
    (inputRef.current as HTMLInputElement).disabled = true;

    return deletePost(id)
      .then(() => dispatch({ type: ActionType.DELETE, payload: id }))
      .catch(reject => {
        if (!error) {
          setError('Unable to delete a todo');
        }

        throw reject;
      })
      .finally(() => {
        setDeletedId(0);
        (inputRef.current as HTMLInputElement).disabled = false;
      })
      .then(() => (inputRef.current as HTMLInputElement).focus());
  };

  const onChangeCompleted = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsEdited(true);

    completedCheck(id, !completed)
      .then(response => {
        dispatch({ type: ActionType.COMPLETED, payload: response });
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setIsEdited(false);
      });
  };

  const editText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextEdited(e.target.value);
  };

  const looseFocusEdited = () => {
    setIsEdited(true);

    if (textEdited !== null) {
      if (textEdited === '') {
        deleteTodo();

        return;
      }

      titleChanged(id, textEdited)
        .then(response => {
          dispatch({ type: ActionType.EDITED, payload: response });
        })
        .catch(() => {
          setError('Unable to update a todo');
        })
        .finally(() => {
          setIsEdited(false);
          setTextEdited(null);
        });
    }
  };

  const onEditedText = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    looseFocusEdited();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          checked={completed}
          className="todo__status"
          onClick={onChangeCompleted}
        />
      </label>

      {textEdited === null ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setTextEdited(title);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={onEditedText} ref={formRef}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={textEdited}
            onChange={editText}
            ref={editForm}
            onBlur={looseFocusEdited}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                looseFocusEdited();
              }
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            id === 0 ||
            deletedId === id ||
            isEdited ||
            (loading.load && loading.side === !completed) ||
            (isDeleteActive && completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
