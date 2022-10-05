import classNames from 'classnames';
import React, {
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from 'react';

interface Props {
  id: number,
  title: string,
  completed: boolean,
  removeTodo: (id: number) => void;
  isAdding: boolean;
  loadingTodos: number[];
  setLoadingTodos: (removedId: number[]) => void;
  toggleTodoStatus: (id: number, completed: boolean) => void;
  todoRenaming: (id: number, title: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  removeTodo,
  isAdding,
  loadingTodos,
  setLoadingTodos,
  toggleTodoStatus,
  todoRenaming,
}) => {
  const renameField = useRef<HTMLInputElement>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const remove = () => {
    setLoadingTodos([...loadingTodos, id]);
    removeTodo(id);
  };

  const toggle = () => {
    toggleTodoStatus(id, completed);
    setLoadingTodos([...loadingTodos, id]);
  };

  const handleRenaming = (event: FormEvent) => {
    event.preventDefault();
    setIsRenaming(false);

    if (renameField.current && renameField.current.value !== title) {
      todoRenaming(id, renameField.current.value);
    }
  };

  const handleRenamingCancel = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => toggle()}
        />
      </label>

      {isRenaming ? (
        <form
          onSubmit={handleRenaming}
          onBlur={handleRenaming}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={renameField}
            defaultValue={title}
            onKeyDown={handleRenamingCancel}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsRenaming(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => remove()}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': loadingTodos.includes(id) || isAdding },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
