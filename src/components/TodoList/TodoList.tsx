import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onRemove: (todoId: number[]) => void;
  onToggle: (todo: Todo) => void;
  onUpdate: (todoId: number, newTitle: string) => void,
  changeTodosIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  onToggle,
  onUpdate,
  changeTodosIds,
}) => {
  const [isRenaming, setIsRenaming] = useState({
    status: false,
    todoId: 0,
    title: '',
  });
  const [renamedTitle, setRenamedTitle] = useState('');
  const renamingTodoField = useRef<HTMLInputElement>(null);

  const cancelUpdating = useCallback(() => setIsRenaming({
    status: false,
    todoId: 0,
    title: '',
  }), []);

  const handleCancelationEsc = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelUpdating();
    }
  }, []);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (isRenaming.title === renamedTitle) {
      return cancelUpdating();
    }

    if (renamedTitle.trim() === '') {
      onRemove([isRenaming.todoId]);

      return cancelUpdating();
    }

    onUpdate(isRenaming.todoId, renamedTitle);

    return cancelUpdating();
  };

  const handleRenaming = (todo: Todo) => {
    setIsRenaming({
      status: true,
      todoId: todo.id,
      title: todo.title,
    });
    setRenamedTitle(todo.title);
  };

  const handleRenamingTitle = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setRenamedTitle(event.target.value), []);

  useEffect(() => {
    if (renamingTodoField.current) {
      renamingTodoField.current.focus();
    }
  }, [isRenaming]);

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => onToggle(todo)}
            />
          </label>

          {(isRenaming.status && todo.id === isRenaming.todoId)
            ? (
              <form onSubmit={handleSubmit}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  ref={renamingTodoField}
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={renamedTitle}
                  onChange={handleRenamingTitle}
                  onBlur={handleSubmit}
                  onKeyUp={handleCancelationEsc}
                />
              </form>
            )
            : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleRenaming(todo)}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => onRemove([todo.id])}
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
              { 'is-active': changeTodosIds.includes(todo.id) },
            )}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
