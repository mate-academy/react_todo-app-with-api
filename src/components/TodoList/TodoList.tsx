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
  const [todoInProcessId, setTodoInProcessId] = useState(Number);
  const [changingId, setChangingId] = useState(Number);
  const [changedTitle, setChangeTitle] = useState(String);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setChangingId(0);
    }
  };

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
                  setTodoInProcessId(todo.id);
                  onChangeComplete(todo.id, !todo.completed);
                  setTodoInProcessId(0);
                }}
              />
            </label>

            {changingId === todo.id ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setChangingId(0);
                  if (todo.title !== changedTitle) {
                    setTodoInProcessId(todo.id);
                    onChangeTodo(todo.id, changedTitle);
                    setTodoInProcessId(0);
                  }

                  setChangeTitle('');
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
                  onBlur={() => {
                    setChangingId(0);
                  }}
                  onKeyUp={(event) => {
                    handleKeyUp(event);
                  }}
                />
              </form>
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setChangingId(todo.id);
                  setChangeTitle(todo.title);
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
                setTodoInProcessId(todo.id);
                onDelete(todo.id);
                setTodoInProcessId(0);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn(
                'modal overlay',
                { 'is-active': todoInProcessId === todo.id },
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
