import { useState } from 'react';
import { updateTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';

import cn from 'classnames';
import { useFocusInput } from '../../hooks/useFocusInput';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isLoading?: boolean;
  handleDeleteTodo: (id: number) => void;
  setloadingIds: (
    loading: number[] | ((prevLoading: number[]) => number[]),
  ) => void;
  loadingIds: number[];
  setErrorMessage: (string: string) => void;
  handleUpdateTodo: (todo: Todo, onSuccess?: VoidFunction) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  isLoading,
  handleDeleteTodo,
  setloadingIds,
  loadingIds,
  setErrorMessage,
  handleUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const focusOnInput = useFocusInput(isEditing);

  function toggleCompleteTodo() {
    setloadingIds(prevIds => [...prevIds, todo.id]);

    const updatedTodo = { ...todo, completed: !todo.completed };

    updateTodos(todo.id, updatedTodo)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(todoItem =>
            todoItem.id === todo.id ? updatedTodo : todoItem,
          ),
        );
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setloadingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  }

  const onSuccess: VoidFunction = () => {
    setIsEditing(false);
  };

  const editTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await handleUpdateTodo(
        {
          ...todo,
          title: trimmedTitle,
        },
        onSuccess,
      );
    } catch (error) {
      setIsEditing(true);
    }
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    editTodo(event);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);

      return;
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleCompleteTodo}
        />
      </label>
      {isEditing ? (
        <form onSubmit={editTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={focusOnInput}
            value={newTitle}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleOnBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
