import {
  FormEvent, useRef, useState, useEffect,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  onSelect: (value: Todo) => Promise<void>;
  filteredTodos: Todo[] | null;
  onDelete: (todoId: number) => void;
  tempTodo: Todo | null,
  selectedTodo: Todo | null,
  isLoading: boolean,
  loadingTodos: Todo[] | null,
  onDubleClick: (value: Todo) => void,
  todos: Todo[],
};

export const Section: React.FC<Props> = ({
  onSelect,
  onDelete,
  onDubleClick,
  filteredTodos,
  tempTodo,
  isLoading,
  loadingTodos,
  selectedTodo,
}) => {
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [updatedQuery, setUpdatedQuery] = useState('');
  const myInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentTodo && myInputRef) {
      myInputRef.current?.focus();
    }
  }, [currentTodo]);

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setCurrentTodo(null);
    }
  };

  document.addEventListener('keydown', handleEscape);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentTodo && !currentTodo?.title.trim()) {
      try {
        await onDelete(currentTodo.id);
      } catch (error) {
        myInputRef.current?.focus();
      }
    }

    if (currentTodo) {
      try {
        await onDubleClick({
          ...currentTodo,
          title: updatedQuery.trim(),
        });

        setUpdatedQuery('');
        setCurrentTodo(null);
      } catch (error) {
        setCurrentTodo(currentTodo);

        myInputRef.current?.focus();
      }
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => onSelect({
                ...todo,
                completed: !todo.completed,
              })}
            />
          </label>

          { currentTodo?.id !== todo.id
            ? (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setCurrentTodo(todo);
                    setUpdatedQuery(todo.title);
                  }}
                  ref={myInputRef}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => {
                    onDelete(todo.id);
                  }}
                >
                  ×
                </button>
              </>
            )
            : (
              <form
                onSubmit={handleSubmit}
                onBlur={handleSubmit}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={updatedQuery}
                  onChange={(event) => {
                    setUpdatedQuery(event.target.value);
                  }}
                  ref={myInputRef}
                />
              </form>
            )}

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': (isLoading && selectedTodo?.id === todo.id)
              || loadingTodos?.find(
                curTodo => todo.id === curTodo.id && isLoading,
              ),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>

        </div>
      ))}

      {(tempTodo) && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) }
    </section>
  );
};
