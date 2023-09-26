import {
  useEffect, useRef, useState,
} from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodo } from '../../context/TodoContext';
import { useError } from '../../context/ErrorContext';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  onEditedId: () => void;
  onDelete: (value: Todo) => void;
  isLoading: boolean;
  onLoad: (value: boolean) => void;
};

export const TodoEditItem: React.FC<Props> = ({
  todo, onEditedId, onDelete, isLoading, onLoad,
}) => {
  const { id, completed } = todo;

  const { todos, setTodos } = useTodo();
  const { setErrorMessage } = useError();

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInputRef.current?.focus();
  }, []);

  const [newTitle, setNewTitle] = useState(todo.title);

  const updateNewTodo = () => {
    if (!newTitle.trim()) {
      onDelete(todo);

      return;
    }

    const updatedTodos = todos.map((currentTodo) => {
      if (currentTodo.id === id) {
        return {
          ...currentTodo,
          title: newTitle,
        };
      }

      return currentTodo;
    });

    const updatedTodo = updatedTodos.find(({ id: updatedId }) => {
      return updatedId === id;
    });

    onLoad(true);

    if (updatedTodo) {
      updateTodo(todo.id, updatedTodo)
        .then(() => setTodos(updatedTodos))
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          onLoad(false);
          onEditedId();
        });
    }
  };

  const handleEditTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateNewTodo();
  };

  const handlePressEscape = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      onEditedId();
    }
  };

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <form onSubmit={handleEditTodo}>
        <input
          ref={editInputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          onBlur={updateNewTodo}
          onKeyUp={handlePressEscape}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={classnames(
          'modal overlay', {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
