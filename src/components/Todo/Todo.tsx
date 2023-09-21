import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodoType } from '../../types/TodoType';
import { deleteTodos, patchTodos } from '../../api/todos';
import { TodoContext } from '../../TodoContext';
import { ErrorsType } from '../../types/ErrorsType';

type Props = {
  todo: TodoType;
};

export const Todo: React.FC<Props> = ({ todo }) => {
  const {
    setErrorMessage,
    setTodos,
    selectedTodos,
  } = useContext(TodoContext);
  const { id, completed, title } = todo;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  const selectedAreDeleting = () => {
    return selectedTodos.some(item => item.id === id);
  };

  const handleSingleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTodos(id);
      setTodos(currentTodos => {
        const newTodos = currentTodos.filter(item => item.id !== id);

        return newTodos;
      });
    } catch {
      setIsLoading(false);
      setErrorMessage(ErrorsType.Delete);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleSingleUpdate = async (updatedTitle: string) => {
    let updatedTodo: TodoType;

    if (updatedTitle) {
      updatedTodo = { ...todo, title: updatedTitle };
    } else {
      updatedTodo = { ...todo, completed: !completed };
    }

    setIsLoading(true);
    try {
      await patchTodos(updatedTodo);
      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(item => item.id === updatedTodo.id);

        newTodos.splice(index, 1, updatedTodo);

        return newTodos;
      });
      setIsLoading(false);
      setIsEditMode(false);
    } catch {
      setIsLoading(false);
      setErrorMessage(ErrorsType.Update);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const submitUpdate = () => {
    if (!newTitle) {
      handleSingleDelete();

      return;
    }

    if (newTitle !== title) {
      handleSingleUpdate(newTitle);

      return;
    }

    setIsEditMode(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Escape': {
        setIsEditMode(false);
        setNewTitle(title);
        break;
      }

      case 'Enter': {
        submitUpdate();
        break;
      }

      default:
        break;
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode, isLoading]);

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => handleSingleUpdate('')}
          checked
        />
      </label>

      {!isEditMode && (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditMode(v => !v)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleSingleDelete}
          >
            ×
          </button>
        </>
      )}

      {isEditMode && (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.currentTarget.value)}
            ref={inputRef}
            onKeyUp={handleKeyUp}
            onBlur={submitUpdate}
          />
        </form>
      )}

      <div className={cn('modal overlay', {
        'is-active': isLoading || selectedAreDeleting(),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
