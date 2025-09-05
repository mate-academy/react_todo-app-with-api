/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef } from 'react';

type Props = {
  todo: Todo;
  loader: boolean;
  chosenTodoIds: number[];
  changingValue: string;
  isEditing: boolean;
  updateTodo: (todo: Todo, title: string) => void;
  deleteTodo: (todoId: number) => void;
  makeTodoComplete: (todo: Todo) => void;
  addProcessTodoId: (value: number) => void;
  setIsEditing: (value: boolean) => void;
  setChangingValue: (value: string) => void;
};

export const TodoRow: React.FC<Props> = ({
  todo,
  loader,
  chosenTodoIds,
  isEditing,
  changingValue,
  updateTodo,
  deleteTodo,
  makeTodoComplete,
  addProcessTodoId,
  setChangingValue,
  setIsEditing,
}) => {
  const changingInputRef = useRef<HTMLInputElement>(null);

  function initChanges(event: React.FormEvent) {
    event?.preventDefault();

    updateTodo(todo, changingValue.trim());
  }

  useEffect(() => {
    changingInputRef.current?.focus();
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            makeTodoComplete(todo);
          }}
        />
      </label>

      {isEditing && chosenTodoIds.includes(todo.id) ? (
        <form onSubmit={initChanges}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changingValue}
            onChange={e => {
              setChangingValue(e.target.value);
            }}
            onBlur={e => {
              initChanges(e);
            }}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setChangingValue('');
              }
            }}
            ref={changingInputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              addProcessTodoId(todo.id);
              setChangingValue(todo.title);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              deleteTodo(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loader && chosenTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
