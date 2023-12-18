import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { updatedTodo } from './api/todos';

type TodoItemProps = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  isDeleting?: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTodo: (todoId: number) => void
  updateTodoList: (updatedTodoItem: Todo) => void
  setErrorMessage: (newMessage: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTodo,
  isDeleting,
  isLoading,
  setIsLoading,
  toggleTodo,
  updateTodoList,
  setErrorMessage,
}) => {
  const [editableTitle, setEditableTitle] = useState(todo.title);
  const { id, completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isPendingDeletion, setIsPendingDeletion] = useState(false);

  const showLoader
  = (id === 0 && isLoading)
  || isUpdatingTitle
  || (isDeleting && isLoading);

  const updateTodoTitle = async (
    todoId: number, newTitle: string,
  ) => {
    setIsUpdatingTitle(true);
    setIsLoading(true);

    const updatedData = { ...todo, title: newTitle };
    const result = await updatedTodo(todoId, updatedData);

    if (result) {
      updateTodoList(updatedData);
    }

    setTimeout(() => {
      setIsUpdatingTitle(false);
      setIsLoading(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editableTitle.trim()) {
      setIsPendingDeletion(true);
      setIsEditing(false);

      return;
    }

    if (editableTitle !== title) {
      try {
        await updateTodoTitle(id, editableTitle);
      } catch (error) {
        setErrorMessage('Unable to update a todo');
        setEditableTitle(title);
      }
    } else {
      setEditableTitle(title);
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (isPendingDeletion) {
      deleteTodo(id);
    }
  }, [isPendingDeletion, deleteTodo, id]);

  const handleToggle = () => {
    toggleTodo(id);
  };

  const handleBlur = () => {
    if (!editableTitle.trim()) {
      deleteTodo(id);
      setIsEditing(false);
    } else if (editableTitle !== title) {
      updateTodoTitle(id, editableTitle);
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditableTitle(title);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(e.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', { completed, active: !completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            data-cy="NewTodoField"
            value={editableTitle}
            className="todoapp__new-todo"
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            placeholder="Empty todo will be deleted"
            // eslint-disable-next-line
            autoFocus
            style={{ paddingLeft: '16px' }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {!isPendingDeletion ? title : ''}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': showLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
