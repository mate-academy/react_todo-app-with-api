/* eslint-disable no-console */
import cn from 'classnames';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { ErrorMessage, PatchTodo, Todo } from '../types/Todo';
import { TodoLoader } from './TodoLoader';
import { editTodo } from '../api/todos';

type Props = {
  todo: Todo;
  isLoading: boolean;
  editedTodo: PatchTodo | null;
  handleDelete: (todoId: number) => void;
  handleEditTodo: (todo: Todo) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleError: (err: ErrorMessage) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading, handleDelete, editedTodo, handleEditTodo, setTodos, handleError,
}) => {
  const [isEdited, setIsEdited] = useState(false); // otwieranie edycji
  const [editedValue, setEditedValue] = useState<string>(todo.title);
  const [toggleOnSave, setToggleOnSave] = useState(false);

  const handleDoubleClick = () => {
    setIsEdited(true);
  };

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedValue(event.target.value);
  };

  // po naciśnięciu enter i on Blur wysylamy request do api przez
  // obsługa błędów na catch / update todos na then
  const handleSubmit = () => {
    console.log('here');

    const updatedTodo: Todo = { ...todo, title: editedValue };

    handleEditTodo(updatedTodo);
    setIsEdited(false);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
    } else if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleToggleStatus = (oldTodo: Todo) => {
    const newTodo = { ...oldTodo, completed: !oldTodo.completed };

    setToggleOnSave(true);
    editTodo(newTodo)
      .then(() => {
        setTodos((prevTodos) => {
          return prevTodos.map(todoItem => {
            if (todoItem.id === newTodo.id) {
              return newTodo;
            }

            return todoItem;
          });
        });
      })
      .catch(() => {
        handleError(ErrorMessage.noUpdateTodo);
      })
      .finally(() => setToggleOnSave(false));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleToggleStatus(todo)}
        />
      </label>

      {isEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedValue}
            onChange={handleEditChange}
            onKeyUp={handleKeyUp}
            onBlur={handleSubmit}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => !isLoading && handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <TodoLoader
        isActive={isLoading || editedTodo?.id === todo.id || toggleOnSave}
      />
    </div>
  );
};

// This todo is being edited
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   This form is shown instead of the title and remove button
//   <form>
//     <input
//       data-cy="TodoTitleField"
//       type="text"
//       className="todo__title-field"
//       placeholder="Empty todo will be deleted"
//       value="Todo is being edited now"
//     />
//   </form>

//   <TodoLoader />
// </div>

// This todo is in loadind state
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   <span data-cy="TodoTitle" className="todo__title">
//     Todo is being saved now
//   </span>

//   <button type="button" className="todo__remove" data-cy="TodoDelete">
//     ×
//   </button>

//   'is-active' class puts this modal on top of the todo
//   <TodoLoader />
// </div>
