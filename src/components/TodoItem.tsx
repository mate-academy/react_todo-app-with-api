import React, { FormEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FocusFiled } from '../types';
import { EditingField } from './EditingField';
import { Loader } from './Loader';

type Props = {
  todo: Todo,
  setEditedTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setEditedTitle: React.Dispatch<React.SetStateAction<string | undefined>>,
  setFocus: React.Dispatch<React.SetStateAction<FocusFiled>>,
  handleUpdateTodoStatus: (todo: Todo) => void,
  editedTodo: Todo | null,
  handleUpdateTodoTitle: (event: FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement, Element>) => void,
  editedTitleTodoRef: React.MutableRefObject<HTMLInputElement | null>,
  editedTitle: string | undefined,
  handleDeleteTodo: (todoId: number) => void
  isLoading: boolean,
  loadingTodos: Todo[] | null,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setEditedTodo,
  setEditedTitle,
  setFocus,
  handleUpdateTodoStatus,
  editedTodo,
  handleUpdateTodoTitle,
  editedTitleTodoRef,
  editedTitle,
  handleDeleteTodo,
  isLoading,
  loadingTodos,
}) => {
  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', {
        completed: todo.completed,
        editing: editedTodo,
      })}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleUpdateTodoStatus(todo)}
        />
      </label>

      {editedTodo?.id === todo.id
        ? (
          <EditingField
            handleUpdateTodoTitle={handleUpdateTodoTitle}
            setEditedTitle={setEditedTitle}
            editedTitleTodoRef={editedTitleTodoRef}
            editedTitle={editedTitle}
            setEditedTodo={setEditedTodo}
            editedTodo={editedTodo}
          />
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setEditedTodo(todo);
                setEditedTitle(todo.title);
                setFocus('edit');
              }}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <Loader
        isLoading={isLoading}
        loadingTodos={loadingTodos}
        todo={todo}
      />
    </div>
  );
};
