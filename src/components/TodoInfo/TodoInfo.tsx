import React, { memo, useState, useCallback } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { NewTodoField } from '../NewTodoField/NewTodoField';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  todo: Todo,
  removeTodo: (todoId: number) => Promise<void>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  changeTodo:(id: number, itemsToUpdate: Partial<Todo>) => Promise<void>
  isTodoUpdating: boolean;
};

export const TodoInfo:React.FC<Props> = memo(({
  newTodoField,
  todo,
  removeTodo,
  setErrorMessage,
  changeTodo,
  isTodoUpdating,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isTitleChange, setIsTitleChange] = useState(false);

  const handleRemoveTodo = () => {
    setIsDeleting(true);
    removeTodo(todo.id);
    setIsDeleting(false);
  };

  const toggleTodoStatus = async () => {
    const isCompleted = !todo.completed;

    setIsToggling(true);

    await changeTodo(todo.id, {
      completed: isCompleted,
    }).catch(() => setErrorMessage(ErrorMessage.UpdateTodoError));

    setIsToggling(false);
  };

  const handleChangeTodo = async (
    id: number,
    itemsToUpdate: Partial<Todo>,
  ) => {
    setIsLoading(true);

    await changeTodo(id, itemsToUpdate);

    setIsLoading(false);
  };

  const cancelEditing = useCallback(() => {
    setIsTitleChange(false);
    setNewTitle(todo.title);
  }, []);

  const updateTitle = useCallback((
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }

    const normalizeTitle = newTitle.trim();

    if (normalizeTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (normalizeTitle === '') {
      handleRemoveTodo();

      return;
    }

    handleChangeTodo(
      todo.id,
      { title: normalizeTitle },
    );
    setIsTitleChange(false);
  }, [newTitle]);

  const status = isLoading || isDeleting || isToggling || isTodoUpdating;

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodoStatus}
        />
      </label>
      {isTitleChange ? (
        <NewTodoField
          newTitle={newTitle}
          newTodoField={newTodoField}
          setNewTitle={setNewTitle}
          updateTitle={updateTitle}
          cancelEditing={cancelEditing}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsTitleChange(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleRemoveTodo}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          // eslint-disable-next-line max-len
          { 'is-active': status })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
