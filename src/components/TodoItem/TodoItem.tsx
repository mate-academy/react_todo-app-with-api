/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  Dispatch,
  SetStateAction,
  RefObject,
  useState,
  useRef,
  useEffect,
  FormEvent,
  KeyboardEvent,
} from 'react';
import { Todo } from '../../types/Todo';
import cN from 'classnames';
import { trimTitle } from '../../utils/trimTitle';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  handleTodoStatusChange?: (id: number, newStatus: boolean) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  loadingTodoIds?: number[];
  setLoadingTodoIds?: Dispatch<SetStateAction<number[]>>;
  addTodoField?: RefObject<HTMLInputElement>;
  handleTitleChange?: (
    editingTodoId: number | null,
    newTitle: string,
  ) => Promise<void> | undefined;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp = false,
  handleTodoStatusChange,
  onDelete,
  loadingTodoIds,
  setLoadingTodoIds,
  addTodoField,
  handleTitleChange,
}) => {
  const { title, id, completed } = todo;
  const [inputValue, setInputValue] = useState<string>(title);
  const editTodoField = useRef<HTMLInputElement>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState<boolean>(false);

  function setFocusOnEditInput() {
    if (editTodoField.current !== null) {
      editTodoField.current.focus();
    }
  }

  useEffect(() => {
    setFocusOnEditInput();
  }, [editingTodoId]);

  function handlerOnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
    }
  }

  function handlerOnDelete() {
    setLoadingTodoIds?.([id]);
    onDelete?.(id).then(() => {
      if (addTodoField?.current !== null) {
        addTodoField?.current.focus();
      }
    });
  }

  function handlerOnSubmit(
    newTitle: string,
    currentTitle: string,
    event?: FormEvent<HTMLFormElement>,
  ) {
    if (event) {
      event.preventDefault();
    }

    if (newTitle.length === 0) {
      handlerOnDelete();

      return;
    }

    const trimedTitle = trimTitle(newTitle);

    if (trimedTitle === currentTitle) {
      setEditingTodoId(null);

      return;
    }

    setIsUpdatingTitle(true);
    const result = handleTitleChange?.(editingTodoId, trimedTitle);

    result
      ?.then(() => {
        setInputValue(trimedTitle);
        setEditingTodoId(null);
      })
      .catch(() => {
        setFocusOnEditInput();
      })
      .finally(() => {
        setIsUpdatingTitle(false);
      });
  }

  return (
    <div key={id} data-cy="Todo" className={cN('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            isTemp ? null : handleTodoStatusChange?.(id, !completed)
          }
        />
      </label>
      {id === editingTodoId ? (
        <form onSubmit={event => handlerOnSubmit(inputValue, title, event)}>
          <input
            onBlur={() => {
              handlerOnSubmit(inputValue, title);
            }}
            onKeyDown={handlerOnKeyDown}
            ref={editTodoField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onChange={event => setInputValue(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setEditingTodoId(id)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>
          <button
            onClick={() => {
              handlerOnDelete();
            }}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cN('modal overlay', {
          'is-active':
            isTemp ||
            loadingTodoIds?.includes(id) ||
            (isUpdatingTitle && id === editingTodoId),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
