import cn from 'classnames';
import { useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onChangeTodo: (id: number, changedTitle: string) => void;
  onChangeComplete: (id: number, complete: boolean) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onChangeComplete,
  onChangeTodo,
}) => {
  const [deletingId, setDeletingId] = useState(Number);
  const [changingId, setChangingId] = useState(Number);
  const [changedTitle, setChangeTitle] = useState(String);

  return (
    <>
      {todos && (
        todos.map(todo => (
          <div
            data-cy="Todo"
            className={cn(
              'todo',
              { completed: todo.completed },
              { active: !todo.completed },
            )}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => {
                  onChangeComplete(todo.id, !todo.completed);
                }}
              />
            </label>

            {changingId === todo.id ? (
              <form
                onSubmit={() => {
                  setChangingId(0);
                  onChangeTodo(todo.id, changedTitle);
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={todo.title}
                  onChange={(event) => {
                    setChangeTitle(event.target.value);
                  }}
                />
              </form>
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setChangingId(todo.id);
                }}
              >
                {todo.title}
              </span>
            )}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                setDeletingId(todo.id);
                onDelete(todo.id);
                setDeletingId(0);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn(
                'modal overlay',
                { 'is-active': deletingId === todo.id },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )))}
    </>
  );
};
