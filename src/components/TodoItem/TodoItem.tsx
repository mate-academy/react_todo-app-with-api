import {
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => Promise<void>,
  isLoading?: boolean,
  updateTodo: (todo: Todo) => Promise<void>,
  titleRef: React.RefObject<HTMLInputElement>,
};

export const TodoItem: FC<Props> = memo(({
  todo,
  removeTodo,
  isLoading,
  updateTodo,
  titleRef,
}) => {
  const [loadingStatus, setLoadingStatus] = useState(isLoading);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');

  const editTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editTitleRef.current?.focus();
  }, [isEditing]);

  const handleRemoveTodo = () => {
    setLoadingStatus(true);

    if (todo.id) {
      removeTodo(todo.id)
        .finally(() => {
          setLoadingStatus(false);
          titleRef.current?.focus();
        });
    }
  };

  const handleSelectedTodo = () => {
    setLoadingStatus(true);
    updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .finally(() => setLoadingStatus(false));
  };

  const handleTitleEdit = () => {
    setIsEditing(true);
    setEditedTodoTitle(todo.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTodoTitle(todo.title);
    }
  };

  const handleEditingSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimedTitle = editedTodoTitle.trim();

    if (!trimedTitle.length) {
      handleRemoveTodo();

      return;
    }

    if (editedTodoTitle === todo.title) {
      setIsEditing(false);
      titleRef.current?.focus();

      return;
    }

    const editedTodo: Todo = {
      ...todo,
      title: trimedTitle,
    };

    setLoadingStatus(true);

    updateTodo(editedTodo)
      .then(() => {
        setIsEditing(false);
        setLoadingStatus(false);
        titleRef.current?.focus();
      })
      .finally(() => setLoadingStatus(false));

    editTitleRef.current?.focus();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          onChange={handleSelectedTodo}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing && (
        <form onSubmit={handleEditingSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTodoTitle}
            onChange={event => setEditedTodoTitle(event.target.value)}
            onBlur={handleEditingSubmit}
            onKeyUp={handleKeyDown}
            ref={editTitleRef}
          />
        </form>
      )}

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTitleEdit}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemoveTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': loadingStatus },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
