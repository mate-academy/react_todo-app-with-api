import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { useTodoContext } from '../../context/TodosProvider';
import { Todo } from '../../types/Todo';

interface TodoCardProps {
  todo: Todo
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const
    {
      handleDeleteTodo,
      tempTodo,
      handleCheckboxClick,
      status,
      isToggled,
      setQueryTitle,
      handleSubmitEdit,
      editFormTodoId,
      setEditFormTodoId,
    } = useTodoContext();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const todoWrapperRef = useRef<HTMLDivElement | null>(null);
  const [localQueryTitle, setLocalQueryTitle] = useState<string>(todo.title);

  useEffect(() => {
    inputRef.current?.focus();
  }, [editFormTodoId]);

  useEffect(() => {
    setQueryTitle(localQueryTitle);
  }, [setQueryTitle, localQueryTitle, editFormTodoId]);

  const handleDocumentClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (
      target.tagName !== 'INPUT'
    ) {
      setEditFormTodoId(-1);
    }
  }, [setEditFormTodoId]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [editFormTodoId, setEditFormTodoId, handleDocumentClick]);

  const handleClose = (key: string) => {
    if (key === 'Escape') {
      setEditFormTodoId(-1);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      ref={todoWrapperRef}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCheckboxClick(todo)}
        />
      </label>

      {editFormTodoId === todo.id
        ? (
          <form onSubmit={(event) => handleSubmitEdit(event, todo)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder={localQueryTitle ? '' : 'Empty todo will be deleted'}
              value={localQueryTitle}
              ref={inputRef}
              onChange={(event) => setLocalQueryTitle(event?.target.value)}
              onKeyUp={(event) => handleClose(event.key)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setLocalQueryTitle(todo.title);
                setEditFormTodoId(todo.id);
              }}
            >
              {localQueryTitle}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
          todo.id === tempTodo?.id
          || status === todo.id
          || isToggled,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
