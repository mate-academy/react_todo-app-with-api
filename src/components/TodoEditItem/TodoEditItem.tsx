import {
  useContext, useEffect, useRef, useState,
} from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';
import { ErrorContext } from '../../context/ErrorContext';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  onEditedId: () => void;
  onDelete: (value: number) => void;
  isLoading: boolean;
  onLoad: (value: boolean) => void;
};

export const TodoEditItem: React.FC<Props> = ({
  todo, onEditedId, onDelete, isLoading, onLoad,
}) => {
  const { id, completed } = todo;
  const { todos, setTodos } = useContext(TodoContext);
  const { setErrorMessage } = useContext(ErrorContext);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInputRef.current?.focus();
  }, []);

  const [newTitle, setNewTitle] = useState(todo.title);

  const handleEditTodo = () => {
    if (newTitle === '') {
      onDelete(todo.id);

      return;
    }

    const todosCopy = [...todos];
    const index = todos.findIndex(({ id: currentId }) => currentId === id);
    const updatedTodo = {
      ...todosCopy[index],
      title: newTitle,
    };

    todosCopy.splice(index, 1, updatedTodo);

    onLoad(true);

    updateTodo(todo.id, updatedTodo)
      .then(() => setTodos(todosCopy))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        onLoad(false);
        onEditedId();
      });
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
          onBlur={onEditedId}
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
