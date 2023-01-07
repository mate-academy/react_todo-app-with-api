import React, { useState } from 'react';
import cn from 'classnames';

import { TodoLoader } from '../TodoLoader/TodoLoader';
import { NewTodoField } from '../NewTodoField/NewTodoField';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  temporary?: boolean;
  isTodoDeleting?: boolean;
  selectedTodoId?: number[];
  isTodoUpdating?: boolean;
  newTodoField?: React.RefObject<HTMLInputElement>;
  onUpdateTodo?: (todoId: number, newData: Partial<Todo>) => Promise<void>;
  onDeleteTodo?: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    temporary = false,
    isTodoDeleting,
    selectedTodoId,
    isTodoUpdating,
    newTodoField,
    onUpdateTodo = () => {},
    onDeleteTodo = () => {},
  } = props;

  const [newTitle, setNewTitle] = useState(todo.title);
  const [isTitleChange, setIsTitleChange] = useState(false);

  const cancelEditing = () => {
    setIsTitleChange(false);
    setNewTitle(todo.title);
  };

  const changeTodoTitle = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event !== undefined) {
      event.preventDefault();
    }

    if (newTitle.trim() === todo.title) {
      cancelEditing();

      return;
    }

    if (newTitle === '') {
      onDeleteTodo(todo.id);
    }

    onUpdateTodo(todo.id, { title: newTitle.trim() });
    setIsTitleChange(false);
  };

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
          onClick={() => onUpdateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isTitleChange ? (
        <NewTodoField
          title={newTitle}
          newTodoField={newTodoField}
          onChange={setNewTitle}
          onSubmit={changeTodoTitle}
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

      {(temporary
        || (isTodoDeleting && selectedTodoId?.includes(todo.id))
        || (isTodoUpdating && selectedTodoId?.includes(todo.id))
      ) && (
        <TodoLoader />
      )}
    </div>
  );
};
