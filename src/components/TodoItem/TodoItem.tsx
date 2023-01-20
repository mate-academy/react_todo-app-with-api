import React, { memo, useCallback, useState } from 'react';
import cn from 'classnames';

import { TodoLoader } from '../TodoLoader/TodoLoader';
import { NewTodoField } from '../NewTodoField/NewTodoField';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  temporary?: boolean;
  isTodoDeleting?: boolean;
  selectedTodosId?: number[];
  isTodoUpdating?: boolean;
  newTodoField?: React.RefObject<HTMLInputElement>;
  onUpdateTodo?: (todoId: number, newData: Partial<Todo>) => Promise<void>;
  onDeleteTodo?: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo,
    temporary = false,
    isTodoDeleting,
    selectedTodosId,
    isTodoUpdating,
    newTodoField,
    onUpdateTodo = () => {},
    onDeleteTodo = () => {},
  } = props;

  const [newTitle, setNewTitle] = useState(todo.title);
  const [isTitleChange, setIsTitleChange] = useState(false);

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

    if (newTitle.trim() === todo.title) {
      cancelEditing();

      return;
    }

    if (newTitle.trim() === '') {
      onDeleteTodo(todo.id);
    }

    onUpdateTodo(
      todo.id,
      { title: newTitle.trim() },
    );
    setIsTitleChange(false);
  }, [newTitle]);

  const isLoaderVisible = temporary
    || ((isTodoDeleting || isTodoUpdating)
      && selectedTodosId?.includes(todo.id));

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => onUpdateTodo(
            todo.id,
            { completed: !todo.completed },
          )}
        />
      </label>

      {isTitleChange ? (
        <NewTodoField
          title={newTitle}
          newTodoField={newTodoField}
          onInputChange={setNewTitle}
          onSubmitForm={changeTodoTitle}
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
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {isLoaderVisible && (
        <TodoLoader />
      )}
    </div>
  );
});
