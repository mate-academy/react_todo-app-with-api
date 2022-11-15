import classNames from 'classnames';
import { useState, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isAdding: boolean;
  deleteTodoAtServer?: (id: number) => void;
  toggleTodoStatus: (id: number, completed: boolean) => Promise<void>;
  updateTodo: (id: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  deleteTodoAtServer,
  toggleTodoStatus,
  updateTodo,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [selectedTodo, setSelectedTodo] = useState<number | null>(null);
  const selectedTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedTodoField.current) {
      selectedTodoField.current.focus();
    }
  }, []);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewTitle(value);
  };

  const handleClick = () => {
    if (deleteTodoAtServer) {
      deleteTodoAtServer(id);
    }
  };

  const handleDoubleClick = (todoId: number, todoTitle: string) => {
    setSelectedTodo(todoId);
    setNewTitle(todoTitle);
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setSelectedTodo(null);
    }
  };

  const saveOnBlur = () => {
    setSelectedTodo(null);
    if (newTitle.trim() === '') {
      if (deleteTodoAtServer) {
        deleteTodoAtServer(id);
      }
    }

    if (newTitle.trim() === title) {
      return;
    }

    setNewTitle(newTitle.trim());
    updateTodo(id, newTitle);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    saveOnBlur();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => toggleTodoStatus(id, !completed)}
          defaultChecked
        />
      </label>

      {selectedTodo === id
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={selectedTodoField}
              className="todo__title-field"
              value={newTitle}
              onChange={handleTitle}
              onBlur={saveOnBlur}
              onKeyDown={cancelEditing}
              disabled={isAdding}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(id, title)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleClick}
            >
              ×
            </button>
          </>
        )}
      <Loader isAdding={isAdding} />
    </div>
  );
};
