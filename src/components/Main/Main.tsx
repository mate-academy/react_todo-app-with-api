import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[],
  onRemoveTodo: (todo: Todo, index: number) => void
  tempTodo: Todo | null | undefined,
  onEditTodo: (
    event: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ) => void,
  hasEditTodo: boolean,
  setHasEditTodo: React.Dispatch<React.SetStateAction<boolean>>,
  onUpdateTodo: (todo: Todo) => Promise<void>,
  setIndexUpdatedTodo: React.Dispatch<React.SetStateAction<number>>;
  indexUpdatedTodo: number;
  onChangeStatusTodo: (todoId: number) => void,
  todoForUpdate: Todo | null,
  setTodoForUpdate: React.Dispatch<React.SetStateAction<Todo | null>>,
};

export const Main: React.FC<Props> = ({
  visibleTodos,
  onRemoveTodo,
  tempTodo,
  onEditTodo,
  hasEditTodo,
  setHasEditTodo,
  onUpdateTodo,
  setIndexUpdatedTodo,
  indexUpdatedTodo,
  onChangeStatusTodo,
  todoForUpdate,
  setTodoForUpdate,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo, index) => {
        if (tempTodo && index === indexUpdatedTodo) {
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
                onClick={() => (onChangeStatusTodo(todo.id))}
              />
            </label>

            {hasEditTodo && todoForUpdate?.id === todo.id
              ? (
                <>
                  <form onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    return onUpdateTodo(todo);
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
              ) : (
                <span
                  className="todo__title"
                  onDoubleClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setTodoForUpdate(todo);
                    setIndexUpdatedTodo(index);
                    setHasEditTodo(true);
                  }}
                >
                  {todo.title}
                </span>
              )}
            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemoveTodo(todo, index)}
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
    </section>
  );
};
