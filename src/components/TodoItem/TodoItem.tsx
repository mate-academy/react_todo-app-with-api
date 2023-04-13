import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useAppContext } from '../AppProvider';
import { TodoForm } from '../TodoForm';
import { TEMP_TODO_ID } from '../../utils/constants';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const {
    todosToRemove: arrayOfTodosToRemove,
    setTodosToRemove: setArrayOfTodosToRemove,
    todosToToggle: arrayOfTodosToToggle,
    changeTodo,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(id === TEMP_TODO_ID);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleRemove = () => {
    setArrayOfTodosToRemove((prev: Todo[]) => [
      ...prev,
      todo,
    ]);
  };

  const handleOnCompletionChange = () => {
    setIsLoading(true);
    changeTodo(id, { completed: !completed })
      .finally(() => setIsLoading(false));
  };

  const handleChangeTitle = useCallback((newTitle: string) => {
    setIsEditMode(false);
    const trimedNewTitle = newTitle.trim();

    if (trimedNewTitle === title) {
      return;
    }

    if (!trimedNewTitle) {
      handleRemove();

      return;
    }

    setIsLoading(true);
    changeTodo(id, { title: trimedNewTitle })
      .then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const isTodoBeeingRemoved = arrayOfTodosToRemove.some(
      todoToRemove => todoToRemove.id === id,
    );

    setIsLoading(isTodoBeeingRemoved);
  }, [arrayOfTodosToRemove]);

  useEffect(() => {
    const isTodoBeeingToggled = arrayOfTodosToToggle.some(
      todoToComplete => todoToComplete.id === id,
    );

    setIsLoading(isTodoBeeingToggled);
  }, [arrayOfTodosToToggle]);

  return (
    <div
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleOnCompletionChange}
        />
      </label>

      {isEditMode
        ? (
          <TodoForm
            title={title}
            changeTitle={handleChangeTitle}
            exitEditMode={() => setIsEditMode(false)}
          />
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditMode(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleRemove}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
