import classNames from 'classnames';
import React, {
  Dispatch, SetStateAction, useContext, useEffect, useRef,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext/TodosContext';

type Props = {
  todo: Todo,
  editedTodoTitle: string,
  setEditedTodoTitle: Dispatch<SetStateAction<string>>,
  handleSpanDoubleClick: (
    id: number,
    title: string
  ) => void,
  handleDeleteTodo: (todoId: number) => void,
  editedTodoId: number | null,
  handleEditTodo: (event: React.FormEvent<HTMLFormElement>,
    todoId: number) => void,
  handleCompleteChange: (todoId: number, cheked: boolean) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editedTodoTitle,
  setEditedTodoTitle,
  handleSpanDoubleClick,
  handleDeleteTodo,
  editedTodoId,
  handleEditTodo,
  handleCompleteChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleEditKeyUp,
    processingIds,
    handleEditTodoOnBlur,
  } = useContext(TodosContext);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => { }}
          onClick={() => {
            handleCompleteChange(todo.id, !todo.completed);
          }}
        />
      </label>

      {editedTodoId === todo.id ? (
        <form onSubmit={(event) => handleEditTodo(event, todo.id)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={editedTodoTitle}
            onChange={(event) => setEditedTodoTitle(event.target.value)}
            onKeyUp={handleEditKeyUp}
            onBlur={() => handleEditTodoOnBlur(todo.id)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            handleSpanDoubleClick(todo.id, todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!editedTodoId && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            handleDeleteTodo(todo.id);
          }}
        >
          ×
        </button>
      )}

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': processingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
