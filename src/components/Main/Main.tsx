import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[],
  onRemoveTodo: (number: number) => void
  tempTodo: Todo | null | undefined,
  onEditTodo: (
    event: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ) => void,
  hasEditTodo: boolean,
  setHasEditTodo: React.Dispatch<React.SetStateAction<boolean>>,
  onUpdateTodo: (params: React.FormEvent<HTMLFormElement>) => Promise<void>
  setIdUpdatedTodo: React.Dispatch<React.SetStateAction<number>>;
  idUpdatedTodo: number;
};

export const Main: React.FC<Props> = ({
  visibleTodos,
  onRemoveTodo,
  tempTodo,
  onEditTodo,
  hasEditTodo,
  setHasEditTodo,
  onUpdateTodo,
  setIdUpdatedTodo,
  idUpdatedTodo,
}) => {
  return (
    <section className="todoapp__main">
      {/* This is a completed todo */}
      {visibleTodos.map((todo, index) => {
        if (tempTodo && index === idUpdatedTodo) {
          return (
            <div className="todo" key={+`0${todo.id}`}>
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>
              <span
                className="todo__title"
              >
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        }

        return (
          <div
            className={cn(
              'todo',
              { completed: todo.completed },
            )}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                onClick={() => (console.log('checked clicked'))}
              />
            </label>

            {!hasEditTodo
              ? (
                <span
                  className="todo__title"
                  onDoubleClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setHasEditTodo(true);
                    setIdUpdatedTodo(index);
                  }}
                >
                  {todo.title}
                </span>
              )
              : (
                <>
                  <form onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    return onUpdateTodo(event);
                  }}
                  >
                    <input
                      className="todo__title-field"
                      type="text"
                      value={todo.title}
                      onChange={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        onEditTodo(event, todo.id);
                      }}
                    />
                  </form>
                </>
              )}
            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemoveTodo(todo.id)}
            >
              ×
            </button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      <div className="todo completed">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>

        <span className="todo__title">Completed Todo</span>

        {/* Remove button appears only on hover */}
        <button type="button" className="todo__remove">×</button>

        {/* overlay will cover the todo while it is being updated */}
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is not completed */}
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span className="todo__title">Not Completed Todo</span>
        <button type="button" className="todo__remove">×</button>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is being edited */}
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        {/* This form is shown instead of the title and remove button */}
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is in loadind state */}
      <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">Todo is being saved now</span>
        <button type="button" className="todo__remove">×</button>

        {/* 'is-active' class puts this modal on top of the todo */}
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
