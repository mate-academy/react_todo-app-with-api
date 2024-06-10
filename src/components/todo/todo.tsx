import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

type Props = {
  list: Todo[];
  todo: Todo;
  idTodo: number;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  onLoading: (status: boolean) => void;
  onError: (status: string) => void;
  onIdTodo: (id: number) => void;
};

export const ToDo: React.FC<Props> = ({
  list,
  todo,
  idTodo,
  onDelete,
  onUpdate,
  onLoading,
  onError,
  onIdTodo,
}) => {
  const { title, userId, id, completed } = todo;
  const [updateTodo, setUpdateTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    titleField.current?.focus();
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    onError('');
    onIdTodo(id);

    if (updateTodo === null) {
      setIsSubmitting(false);

      return;
    }

    if (!updateTodo.title.trim()) {
      onIdTodo(updateTodo.id);
      onDelete(updateTodo.id)
        .then(() => {
          setUpdateTodo(null);
          onIdTodo(updateTodo.id);
        })
        .finally(() => {
          onLoading(false);
          onIdTodo(0);
        });
    } else {
      onIdTodo(0);
      const todoActual = list.find(item => item.id === updateTodo.id);

      if (todoActual && updateTodo.title === todoActual.title) {
        setUpdateTodo(null);
        setIsSubmitting(false);

        return;
      }

      onIdTodo(updateTodo.id);
      onLoading(true);
      onUpdate({ ...updateTodo, title: updateTodo.title.trim() })
        .then(() => {
          setUpdateTodo(null);
          onIdTodo(updateTodo.id);
        })
        .finally(() => {
          onLoading(false);
          onIdTodo(0);
        });
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChecked = () => {
    onLoading(true);
    onIdTodo(id);
    const updateCompletedTodo = {
      ...todo,
      completed: !completed,
    };

    onUpdate(updateCompletedTodo)
      .then(() => setUpdateTodo(null))
      .finally(() => {
        onLoading(false);
        onIdTodo(0);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setUpdateTodo(null);

      return;
    }

    if (event.key === 'Enter') {
      if (!isSubmitting) {
        handleSubmit();
      }
    }
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    if (updateTodo) {
      setUpdateTodo(currentTodo => {
        if (currentTodo === null) {
          return null;
        }

        return {
          ...currentTodo,
          title: event.target.value,
        };
      });
    }
  };

  const handleBlur = () => {
    if (!isSubmitting) {
      handleSubmit();
    }

    return;
  };

  return (
    <div data-cy="Todo" className={`todo ${completed && 'completed'}`} key={id}>
      {/* eslint-disable jsx-a11y/label-has-associated-control  */}
      <label className="todo__status-label" htmlFor={'' + id}>
        <input
          id={'' + id}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleChecked}
        />
      </label>

      {updateTodo ? (
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
          }}
        >
          <input
            value={updateTodo?.title}
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={event => handleChangeTitle(event)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setUpdateTodo({ title, id, userId, completed });
            }}
          >
            {title}
          </span>
          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onIdTodo(id);
              onDelete(id);
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': id === idTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
