import classNames from 'classnames';
import {
  FC,
  memo,
  useCallback,
  useContext,
  useState,
} from 'react';
import { updateTodo } from '../../api/todos';
import { TodoContext } from '../../TodoContext/TodoContext';
import { NewError } from '../../types/ErrorsList';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todo: Todo;
  isLoadingNewTodo?: boolean;
};

export const TodoItem: FC<Props> = memo(({
  todo,
  isLoadingNewTodo,
}) => {
  const {
    updatingTodoId,
    isRemovingCompleted,
    isUpdatingEveryStatus,
    isEveryTotoCompleted,
    setUpdatingTodoId,
    setTodos,
    setVisibleError,
  } = useContext(TodoContext);

  const [isRemoving, setIsRemoving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const isUpdating = todo.id === updatingTodoId;
  const isRemovingAllCompleted = todo.completed && isRemovingCompleted;
  const isUpdatingEveryStatusTodo = (!todo.completed && isUpdatingEveryStatus)
    || (isEveryTotoCompleted && isUpdatingEveryStatus);
  const isWorkingLoader = isLoadingNewTodo
    || isRemoving
    || isRemovingAllCompleted
    || isUpdating
    || isUpdatingEveryStatusTodo;

  const handleRemoveTodo = useCallback(async () => {
    setIsRemoving(true);
    try {
      await client.delete(`/todos/${todo.id}`);

      setTodos((prevTodos) => prevTodos.filter(
        (fileredTodo) => fileredTodo.id !== todo.id,
      ));
    } catch (error) {
      setVisibleError(NewError.Remove);
    }
  }, [todo]);

  const handleUpdateTodo = useCallback(async () => {
    setUpdatingTodoId(todo.id);
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    try {
      await updateTodo(updatedTodo);

      setTodos((prevTodos) => prevTodos.map((prevTodo) => (
        prevTodo.id === todo.id ? updatedTodo : prevTodo
      )));
    } catch (error) {
      setVisibleError(NewError.Update);
    } finally {
      setUpdatingTodoId(null);
      setIsEditing(false);
    }
  }, [todo]);

  const handleTodoDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleTitleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedTitle(event.target.value);
  }, []);

  const onTodoTitleUpdate = useCallback(async (
    todoToUpdate: Todo,
    newTitle: string,
  ) => {
    setUpdatingTodoId(todoToUpdate.id);

    try {
      const updatedTodo = await updateTodo({
        ...todoToUpdate,
        title: newTitle,
      });

      setTodos((prevTodos) => prevTodos.map((prevTodo) => (
        prevTodo.id === todoToUpdate.id ? updatedTodo : prevTodo
      )));
    } catch (error) {
      setVisibleError(NewError.Update);
    } finally {
      setUpdatingTodoId(null);
    }
  }, []);

  const handleTodoBlur = useCallback(() => {
    setIsEditing(false);

    if (editedTitle !== todo.title) {
      onTodoTitleUpdate(todo, editedTitle);
    }
  }, [todo, editedTitle, onTodoTitleUpdate]);

  const handleTodoKeyDown = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  }, [todo]);

  const handleUpdateTodoTitle = useCallback(() => {
    onTodoTitleUpdate(todo, editedTitle);
    setIsEditing(false);
  }, [todo, editedTitle, onTodoTitleUpdate]);

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleUpdateTodo}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdateTodoTitle}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="What needs to be done?"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTodoBlur}
            onKeyDown={handleTodoKeyDown}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={handleTodoDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleRemoveTodo}
            disabled={isWorkingLoader}
          >
            ×
          </button>

          <div className={classNames('modal', 'overlay', {
            'is-active': isWorkingLoader,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
});
