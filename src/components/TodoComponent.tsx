/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useState } from 'react';
import '../styles/todo.scss';

type Props = {
  todo: Todo;
  onRemoveTodo: (id: number) => void;
  isLoading?: boolean;
  onUpdateTodo: (todo: Todo) => Promise<Todo>;
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  isLoading,
  onRemoveTodo,
  onUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(todo.completed);
  const [isToLoad, setIsToLoad] = useState(isLoading);
  const [todoTitle, setTodoTitle] = useState<string>(todo.title);

  const saveChangesHandler = async () => {
    if (todo.title === todoTitle) {
      setIsEditing(false);

      return;
    }

    try {
      setIsToLoad(true);
      const trimmedTodoTitle = todoTitle.trim();

      if (trimmedTodoTitle === '') {
        await onRemoveTodo(todo.id);
      } else {
        const newTodo = await onUpdateTodo({
          ...todo,
          title: trimmedTodoTitle,
        });

        setTodoTitle(newTodo.title);
      }

      setIsEditing(false);
    } catch (err) {
      setIsEditing(true);
    } finally {
      setIsToLoad(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTodoTitle(todo.title);
      setIsEditing(false);
    }
  };

  const toggleStatusHandle = async () => {
    try {
      setIsToLoad(true);
      const newTodo = todo;

      const todoFromServer = await onUpdateTodo({
        ...newTodo,
        completed: !isCompleted,
      });

      setIsCompleted(todoFromServer.completed);
    } catch (err) {
    } finally {
      setIsToLoad(false);
    }
  };

  useEffect(() => {
    if (todo.isLoaded !== undefined) {
      setIsToLoad(todo.isLoaded);
    }
  }, [todo.isLoaded]);

  useEffect(() => {
    setIsCompleted(todo.completed);
  }, [todo.completed]);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await saveChangesHandler();
  };

  const onRemoveButtonClickHandler = async () => {
    try {
      setIsToLoad(true);
      await onRemoveTodo(todo.id);
    } catch (err) {
    } finally {
      setIsToLoad(false);
    }
  };

  const onDoubleClickHandler = () => {
    setIsEditing(true);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames(
        'todo item-enter item-enter-active',
        isCompleted && 'completed',
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          defaultChecked={isCompleted}
          onClick={toggleStatusHandle}
        />
      </label>
      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onDoubleClickHandler}
          >
            {todoTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onRemoveButtonClickHandler}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={onSubmitHandler}>
          <input
            data-cy="TodoTitleField"
            type="text"
            value={todoTitle}
            onKeyUp={handleKeyUp}
            onChange={e => {
              setTodoTitle(e.target.value);
            }}
            className="todo__title-field"
            onBlur={saveChangesHandler}
            autoFocus
          />
        </form>
      )}
      {/* Remove button appears only on hover */}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', isToLoad && 'is-active')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
