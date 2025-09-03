import { useState } from 'react';

import { Loader } from '../Loader/Loader';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  processingIds: number[];
  isLoading: boolean;
  handleDeleteTodo: (id: number) => void;
  handleToggleStatus: (todo: Todo) => void;
  handleUpdateTodo: (todoId: number, newTitle: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  processingIds,
  handleDeleteTodo,
  handleToggleStatus,
  handleUpdateTodo,
}) => {
  const [isTodoEditing, setIsTodoEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(todo.title);

  const updateCurrentTodo = async (currentId: number, newTitle: string) => {
    if (newTitle === todo.title) {
      setIsTodoEditing(false);

      return;
    }

    if (newTitle === '') {
      handleDeleteTodo(currentId);

      return;
    }

    const res = await handleUpdateTodo(currentId, newTitle);

    if (res) {
      setIsTodoEditing(false);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newTitle: string = event.target.value.trim();
    const currentId: number = todo.id;

    updateCurrentTodo(currentId, newTitle);
  };

  const handleEditingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTitle: string = inputValue.trim();
    const currentId: number = todo.id;

    updateCurrentTodo(currentId, newTitle);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setIsTodoEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" aria-label="true">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleToggleStatus(todo)}
        />
      </label>

      {isTodoEditing ? (
        <form onSubmit={handleEditingSubmit} onKeyUp={handleKeyUp}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            defaultValue={todo.title}
            onBlur={handleBlur}
            onChange={event => setInputValue(event.currentTarget.value)}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsTodoEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <Loader
        isLoading={isLoading}
        isProcessing={processingIds.includes(todo.id)}
      />
    </div>
  );
};
