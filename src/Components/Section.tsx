import { FormEvent, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  onSelect: (value: Todo) => void;
  filteredTodos: Todo[] | null;
  onDelete: (todoId: number) => void;
  tempTodo: Todo | null,
  tempTodos: Todo[] | null,
  selectedTodo: Todo | null,
  isLoad: boolean,
  onDubleClick: (value: Todo) => void,
};

export const Section: React.FC<Props> = ({
  onSelect,
  onDelete,
  onDubleClick,
  filteredTodos,
  tempTodo,
  tempTodos,
  isLoad,
  selectedTodo,
}) => {
  const [isDubleClick, setIsDubleClick] = useState<Todo | null>(null);
  const [updatedQuery, setUpdatedQuery] = useState('');
  const myInputRef = useRef<HTMLInputElement>(null);

  // const handleDubbleClick = () => {
  // };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsDubleClick(null);
    }
  };

  document.addEventListener('keydown', handleEscape);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isDubleClick) {
      onDubleClick({
        ...isDubleClick,
        title: updatedQuery,
      });
    }

    setIsDubleClick(null);
    setUpdatedQuery('');
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

          {isDubleClick?.id !== todo.id
            ? (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setInterval(() => {
                      myInputRef.current?.focus();
                    }, 0);
                    setIsDubleClick(todo);
                    setUpdatedQuery(todo.title);
                  }}
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
              'is-active': (isLoad
              && selectedTodo?.id === todo.id)
              || (isLoad && tempTodos?.find(
                tempT => tempT.id === todo.id,
              )),
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
