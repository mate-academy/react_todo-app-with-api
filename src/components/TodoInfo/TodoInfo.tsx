import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';
import { updateTodo } from '../../api/todos';
import { NewTodoField } from '../NewTodoField/NewTodoField';

interface Props {
  todo: Todo;
  removeTodo: (todoId: number) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  changeTodo:(todoId: number, fieldsToUpdate: Partial<Todo>) => Promise<void>;
  newTodoField:React.RefObject<HTMLInputElement>;
  isUpdating: boolean;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  setErrorMessage,
  changeTodo,
  newTodoField,
  isUpdating,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isTitleChange, setIsTitleChange] = useState(false);

  const handleDeleteTodo = async () => {
    setIsDeleting(true);

    await removeTodo(todo.id);

    setIsDeleting(false);
  };

  const onToggleCompleted = async () => {
    const isCompleted = !todo.completed;

    setIsToggling(true);

    await updateTodo(todo.id, {
      completed: isCompleted,
    }).catch(() => setErrorMessage('Unable to update todo'));

    setIsToggling(false);
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
    setNewTitle(todo.title);
  }, []);

  const changeTodoTitle = useCallback((
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
      handleDeleteTodo();

      return;
    }

    handleChangeTodo(
      todo.id,
      { title: normalizeTitle },
    );
    setIsTitleChange(false);
  }, [newTitle]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */}
      <label
        className="todo__status-label"
        onClick={onToggleCompleted}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
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

      <TodoLoader
        isLoading={isLoading || isDeleting || isToggling || isUpdating}
      />
    </div>
  );
};
