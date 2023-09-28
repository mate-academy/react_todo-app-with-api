/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { KeyboardEvent, useEffect, useState } from 'react';
import { Todo as TodoType } from '../types/Todo';
import { deleteTodo, updateIsCompleted, updateTitle } from '../api/todos';

interface TodoProps {
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>,
  todo: TodoType,
  todos: TodoType[],
  temp:boolean,
  deleteTask: (id: number) => void,
  setError: (error:string) => void,
  userId: number,
}

export const Todo: React.FC<TodoProps> = ({
  todo, temp, deleteTask, setError, setTodos, userId, todos,
}) => {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [isChecked, setIsChecked] = useState(todo.completed);
  const [titleState, setTitleState] = useState(todo.title);
  const [inProgress, setInProgress] = useState(temp);

  const handleCheckbox = (
    checkboxCurrentState: boolean,
  ) => {
    setIsChecked(checkboxCurrentState);

    setTodos(prev => prev.map(item => {
      if (item.id === todo.id) {
        return { ...item, completed: !isChecked };
      }

      return item;
    }));

    setInProgress(true);
    updateIsCompleted(todo.id, !isChecked, userId)
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setInProgress(false);
      });
  };

  const handleRemoveTodo = () => {
    setInProgress(true);
    deleteTodo(todo.id)
      .then(res => {
        if (res) {
          deleteTask(todo.id);
          setTodos((prev:TodoType[]) => prev
            .filter((todoItem: TodoType) => todoItem.id !== todo.id));
        }
      })
      .catch(() => setError('Unable to delete a todo'));
  };

  const handleChangeTitle = (newTitle:string) => {
    setTitleState(newTitle);
  };

  useEffect(() => {
    setIsChecked(todo.completed);
  }, [todos]);

  const handleTitleUpdate = () => {
    setIsTodoEditable(false);
    setInProgress(true);
    updateTitle(todo.id, titleState)
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setInProgress(false);
      });
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleTitleUpdate();
    }
  };

  return (
    <div className={`todo ${isChecked
      ? 'completed'
      : ''}`}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={event => handleCheckbox(event.target.checked)}
        />
      </label>

      {isTodoEditable
        ? (
          <form>
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={titleState}
              onChange={event => handleChangeTitle(event?.target.value)}
              onKeyDown={handleEnter}
              onBlur={handleTitleUpdate}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onClick={() => setIsTodoEditable(true)}
            >
              {titleState}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleRemoveTodo}
            >
              ×
            </button>
          </>
        )}
      <div className={`modal overlay ${inProgress ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
