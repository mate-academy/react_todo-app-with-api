import React, { memo, useState, useCallback } from 'react';
import cn from 'classnames';
import { TodoLoader } from '../TodoLoader';
import { NewTodoField } from '../NewTodoField';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo:(todoId: number) => Promise<void>;
  changeTodo:(todoId: number, fieldsToUpdate: Partial<Todo>) => Promise<void>;
  newTodoField:React.RefObject<HTMLInputElement>;
  isUpdating:boolean;
  temporary?: boolean
};

export const TodoInfo: React.FC<Props> = memo(({
  todo,
  removeTodo,
  changeTodo,
  newTodoField,
  isUpdating,
  temporary = false,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isTitleChange, setIsTitleChange] = useState(false);

  const handleDeleteTodo = async () => {
    setIsLoading(true);

    await removeTodo(id);

    setIsLoading(false);
  };

  const handleChangeTodo = async (
    todoId: number,
    fieldsToUpdate: Partial<Todo>,
  ) => {
    setIsLoading(true);

    await changeTodo(todoId, fieldsToUpdate);

    setIsLoading(false);
  };

  const cancelEditing = useCallback(() => {
    setIsTitleChange(false);
    setNewTitle(title);
  }, []);

  const changeTodoTitle = useCallback((
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }

    const normalizeTitle = newTitle.trim();

    if (normalizeTitle === title) {
      cancelEditing();

      return;
    }

    if (normalizeTitle === '') {
      handleDeleteTodo();

      return;
    }

    handleChangeTodo(
      id,
      { title: normalizeTitle },
    );
    setIsTitleChange(false);
  }, [newTitle]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => handleChangeTodo(
            todo.id,
            { completed: !todo.completed },
          )}
        />
      </label>

      {isTitleChange ? (
        <NewTodoField
          title={newTitle}
          newTodoField={newTodoField}
          setNewTitle={setNewTitle}
          submitForm={changeTodoTitle}
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
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader isLoading={isLoading || isUpdating || temporary} />
    </div>
  );
});
