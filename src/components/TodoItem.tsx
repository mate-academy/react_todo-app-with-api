/* eslint-disable react/display-name */
import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Todo, ErrorMessages } from '../types';
import cn from 'classnames';

interface Props {
  todo: Todo;
  handleDeleteTodo?: (todoId: number) => void;
  updateTodo?: (todo: Todo) => Promise<void>;
  todosBeingProcessed?: number[];
  setErrorMessage?: (arg: string) => void;
}

export const TodoItem: React.FC<Props> = memo(
  ({
    todo,
    handleDeleteTodo = () => {},
    updateTodo,
    todosBeingProcessed,
    setErrorMessage = () => {},
  }: Props) => {
    const { id, title, completed } = todo;
    const [updatedTodoTitle, setUpdatedTodoTitle] = useState(title);
    const [isTodoBeingEdited, setIsTodoBeingEdited] = useState(false);
    const [syntheticAutofocusUpdate, setSyntheticAutofocusUpdate] = useState(0);

    const todoTitleInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (todoTitleInput.current) {
        todoTitleInput.current.focus();
      }
    }, [isTodoBeingEdited, syntheticAutofocusUpdate]);

    const handleEscapePress = useCallback((event: KeyboardEvent) => {
      const { key } = event;

      if (key === 'Escape') {
        setUpdatedTodoTitle(title);
        setIsTodoBeingEdited(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      window.addEventListener('keydown', handleEscapePress);

      return () => {
        window.removeEventListener('keydown', handleEscapePress);
      };
    });

    const handleTodoTitleUpdate = async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();
      const normalizedTitle = updatedTodoTitle.trim();

      if (todo.title === updatedTodoTitle) {
        setIsTodoBeingEdited(false);

        return;
      }

      if (!normalizedTitle) {
        try {
          handleDeleteTodo(id);
        } catch (error) {
          setSyntheticAutofocusUpdate(Math.random());
          setIsTodoBeingEdited(true);
        }

        return;
      }

      if (updateTodo) {
        setUpdatedTodoTitle(normalizedTitle);

        const newTodo = { ...todo, title: normalizedTitle };

        try {
          await updateTodo(newTodo);
          setIsTodoBeingEdited(false);
        } catch (error) {
          setSyntheticAutofocusUpdate(Math.random());
          setErrorMessage(ErrorMessages.UPDATE_TODO_ERROR);
          setIsTodoBeingEdited(true);
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn('error');
      }
    };

    return (
      <div
        data-cy="Todo"
        // eslint-disable-next-line prettier/prettier
        className={cn('todo', { 'completed': completed })}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => {
              if (updateTodo) {
                const newTodo = { ...todo, completed: !todo.completed };

                updateTodo(newTodo);
              }
            }}
          />
        </label>

        {isTodoBeingEdited ? (
          <form onSubmit={handleTodoTitleUpdate} onBlur={handleTodoTitleUpdate}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={todoTitleInput}
              value={updatedTodoTitle}
              disabled={todosBeingProcessed?.includes(id)}
              onChange={event => setUpdatedTodoTitle(event.target.value)}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsTodoBeingEdited(true)}
            >
              {updatedTodoTitle}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              х
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': todo.id === 0 || todosBeingProcessed?.includes(id),
          })}
        >
          {(todo.id === 0 || todosBeingProcessed?.includes(id)) && (
            <div className="modal-background has-background-white-ter" />
          )}
          <div className="loader" />
        </div>
      </div>
    );
  },
);
