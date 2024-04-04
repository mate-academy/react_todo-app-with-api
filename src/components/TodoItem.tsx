import { ChangeEvent, FC, KeyboardEvent, useState } from 'react';
import { Todo } from '../types';
import { useTodos } from '../utils/TodosContext';
import cn from 'classnames';

interface Props {
  todo: Todo;
}

export const TodoItem: FC<Props> = ({ todo }) => {
  const { removeTodo, loadingTodosIds, toggleOne, updateTitle } = useTodos();
  const [idToEdit, setIdToEdit] = useState<number | null>(null);
  const [textToEdit, setTextToEdit] = useState(todo.title);
  const isLoadingActive = loadingTodosIds.includes(todo.id) || todo.id === 0;

  const toggleEditTodo = (todoId: number) => {
    setIdToEdit(todoId);
    setTextToEdit(todo.title);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextToEdit(e.target.value);
  };

  const handleRename = async () => {
    const newText = textToEdit.trim();

    if (newText === todo.title) {
      setIdToEdit(null);

      return;
    }

    if (!newText) {
      removeTodo(todo.id);
    } else {
      updateTitle(todo.id, newText, async () => setIdToEdit(null));
    }
  };

  const handleInputKeyUp = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleRename();
    }

    if (e.key === 'Escape') {
      setIdToEdit(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={() => toggleEditTodo(todo.id)}
    >
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleOne(todo.id)}
        />
      </label>

      {!idToEdit ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={textToEdit}
            onChange={handleInputChange}
            onKeyUp={e => handleInputKeyUp(e)}
            onBlur={handleRename}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoadingActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
