import React, {
  useState, ChangeEvent, FormEvent, useCallback,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoRenameForm } from '../TodoRenameForm';
import { removeTodo, renameTodo, updateStatusTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  onDeleteTodo: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isLoading: boolean;
  deletedTodoIds: number[];
  deleteTodoId: number;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  loadTodos: () => Promise<void>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTodoId: React.Dispatch<React.SetStateAction<number>>
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isLoading,
  deletedTodoIds,
  deleteTodoId,
  setHasError,
  setErrorMessage,
  loadTodos,
  setIsLoading,
  setActiveTodoId,
}) => {
  const { title, completed, id } = todo;
  const [isChecked, setIsChecked] = useState(false);
  const [isExistForm, setIsExistForm] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const updateTodoStatus = async () => {
    setIsChecked(!isChecked);
    setIsLoading(true);
    setActiveTodoId(id);

    try {
      await updateStatusTodo(id, completed);
      await loadTodos();
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setActiveTodoId(0);
    }
  };

  const updateTodoTitle = async () => {
    setActiveTodoId(id);

    try {
      if (!newTitle.trim()) {
        setIsLoading(true);
        await removeTodo(id);
        loadTodos();

        return;
      }

      if (newTitle === title) {
        return;
      }

      setNewTitle(newTitle.trim());
      await renameTodo(id, newTitle);
      setIsLoading(true);
      await loadTodos();
    } catch {
      setHasError(true);
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setActiveTodoId(0);
      setIsExistForm(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await updateTodoTitle();
    setIsExistForm(false);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setNewTitle(title);
        setIsExistForm(false);
      }
    }, [newTitle],
  );

  const handleOnBlur = useCallback(() => {
    updateTodoTitle();
    setIsExistForm(false);
  }, [updateTodoTitle]);

  const handleDoubleClick = useCallback(() => {
    setIsExistForm(true);
  }, []);

  return (
    <li
      data-cy="Todo"
      key={id}
      className={classNames('todo',
        { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={updateTodoStatus}
        />
      </label>

      {isExistForm
        ? (
          <TodoRenameForm
            newTitle={newTitle}
            handleSubmit={handleSubmit}
            handleInput={handleInput}
            handleInputKeyDown={handleInputKeyDown}
            handleOnBlur={handleOnBlur}
          />
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              value={id}
              onClick={onDeleteTodo}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={((id === deleteTodoId)
          || deletedTodoIds.includes(id))
          && isLoading
          ? 'modal overlay is-active'
          : 'modal overlay'}
      >
        <div
          className="modal-background has-background-white-ter"
        />

        <div className="loader" />
      </div>
    </li>
  );
};
