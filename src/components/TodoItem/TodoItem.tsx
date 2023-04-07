import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useAppContext } from '../AppProvider';
import { TodoForm } from '../TodoForm';

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
    arrayOfTodosToRemove,
    setArrayOfTodosToRemove,
    arrayOfTodosToToggle,
    changeTodo,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(id === 0);
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
      .then(() => setIsLoading(false));
  };

  const handleChangeTitle = useCallback((newTitle: string) => {
    setIsEditMode(false);

    if (newTitle === title) {
      return;
    }

    if (!newTitle) {
      handleRemove();

      return;
    }

    setIsLoading(true);
    changeTodo(id, { title: newTitle })
      .then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const isTodoBeeingRemoved = arrayOfTodosToRemove.some(
      todoToRemove => todoToRemove.id === id,
    );

    setIsLoading(isTodoBeeingRemoved);
  }, [arrayOfTodosToRemove]);

  useEffect(() => {
    const isTodoBeeingRemoved = arrayOfTodosToToggle.some(
      todoToComplete => todoToComplete.id === id,
    );

    setIsLoading(isTodoBeeingRemoved);
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
            handleChangeTitle={handleChangeTitle}
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
