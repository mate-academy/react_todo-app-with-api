import classNames from 'classnames';
import React, { KeyboardEventHandler, useCallback } from 'react';
import { Todo } from '../../types/Todo';
import '../../styles/index.scss';

type Props = {
  todos: Todo[];
  newTodo: Todo | null;
  isTodoOnLoad: boolean;
  onDelete: (id: number) => void;
  pickedTodoId: number[];
  handleTodoToggle: (id: number, completed: boolean) => void;
  handleBlur: () => void;
  setTodoIdToChange: (num: number | null) => void;
  todoIdToChange: number | null;
  newTitle: string;
  setNewTitle: (str: string) => void;
  handleOnKeyDown: KeyboardEventHandler<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  newTodo,
  isTodoOnLoad,
  onDelete,
  pickedTodoId,
  handleTodoToggle,
  handleBlur,
  setTodoIdToChange,
  todoIdToChange,
  newTitle,
  setNewTitle,
  handleOnKeyDown,
}) => {
  const callbackRef = useCallback((inputElement: HTMLInputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const handleDoubleClick = async (id: number, title: string) => {
    setTodoIdToChange(id);
    setNewTitle(title);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {(todos.length > 0 || isTodoOnLoad) && (
        todos.map((todo: Todo) => {
          return (
            <div
              data-cy="Todo"
              className={classNames(
                'todo',
                { completed: todo.completed },
              )}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onClick={() => handleTodoToggle(todo.id, todo.completed)}
                />
              </label>

              {todoIdToChange === todo.id ? (
                <form
                  onBlur={handleBlur}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={newTitle}
                    onChange={(event) => {
                      setNewTitle(event.target.value);
                    }}
                    ref={callbackRef}
                    onKeyDown={handleOnKeyDown}
                  />
                </form>
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => handleDoubleClick(todo.id, todo.title)}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    onClick={() => onDelete(todo.id)}
                  >
                    ×
                  </button>
                </>
              )}

              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal',
                  'overlay',
                  { 'is-active': pickedTodoId.includes(todo.id) },
                )}
              >
                <div
                  className="modal-background has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          );
        })
      )}

      {(isTodoOnLoad && newTodo) && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {newTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
