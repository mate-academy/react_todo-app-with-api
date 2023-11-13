import {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { ErrorMessage } from '../../context/TodoError';
import { waitToClose } from '../../utils/hideErrorWithDelay';

type TTodoItemProps = {
  todo: Todo;
  deletedTodoIds: number[];
  handleCheckButton: (todoToCheck: Todo) => void;
  handleDeleteBtn: (todoId: number) => void;
  setTodos: (callblack: (prev: Todo[]) => Todo[]) => void;
  inputFieldRef: { current: HTMLInputElement | null };
  setDeletedTodoIds: (callblack: (prev: number[]) => number[]) => void;
  hasUpdateTodoErrorTimerId: { current: number };
};

export const TodoItem: FC<TTodoItemProps> = ({
  todo,
  deletedTodoIds,
  handleCheckButton,
  handleDeleteBtn,
  setTodos,
  inputFieldRef,
  setDeletedTodoIds,
  hasUpdateTodoErrorTimerId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const doubleInputFocus = useRef<HTMLInputElement | null>(null);
  const [updatedValue, setUpdatedValue] = useState(todo.title);

  const { setErrorMessage } = useContext(ErrorMessage);

  useEffect(() => {
    if (doubleInputFocus.current) {
      doubleInputFocus.current.focus();
    }
  }, [isEditing]);

  const handleChangeDoubleCLick = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUpdatedValue(event.target.value);
  };

  const handleSubmitEditing = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (updatedValue.trim() === todo.title.trim()) {
      return;
    }

    (async () => {
      setDeletedTodoIds(prevIds => [...prevIds, todo.id]);

      try {
        if (inputFieldRef.current) {
          inputFieldRef.current.focus();
        }

        await updateTodo(todo.id, {
          ...todo,
          title: updatedValue,
        });

        setTodos(prevTodos => prevTodos.map((prevTodo) => (
          prevTodo.id === todo.id ? ({
            ...prevTodo,
            title: updatedValue,
          }) : ({
            ...prevTodo,
          }))));

        setDeletedTodoIds(() => []);
      } catch (error) {
        setErrorMessage('Unable to update a todo');

        // eslint-disable-next-line no-param-reassign
        hasUpdateTodoErrorTimerId.current = waitToClose(3000, setErrorMessage);

        // eslint-disable-next-line no-console
        console.warn(error);
      }

      setDeletedTodoIds(() => []);
    })();
  };

  const handleDoubleInputClick = () => {
    setIsEditing(true);
    setUpdatedValue(todo.title);
  };

  const handleBlurFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!updatedValue) {
      handleDeleteBtn(todo.id);
    }

    handleSubmitEditing(event);
    setIsEditing(false);
  };

  const handleEscTodoInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setUpdatedValue(todo.title);
      setIsEditing(false);
    }
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
          onClick={() => handleCheckButton(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmitEditing}
          onBlur={handleBlurFormSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedValue}
            onChange={handleChangeDoubleCLick}
            ref={doubleInputFocus}
            onKeyDown={handleEscTodoInput}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleInputClick}
          >
            {updatedValue}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteBtn(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': deletedTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
