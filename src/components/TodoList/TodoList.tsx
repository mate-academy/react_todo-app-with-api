import React, { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number, reload: boolean) => Promise<void>;
  loadingTodos: number[];
  addLoadingTodo: (id: number) => void;
  changeTodoCompleted: (id: number, todoServer: Partial<Todo>) => Promise<void>;
  isAdding: boolean;
};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  loadingTodos,
  addLoadingTodo,
  changeTodoCompleted,
  isAdding,
}) => {
  const [input, setInput] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState(0);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    changeTodoCompleted(selectedTodoId, { title: input });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const {
          id,
          completed,
          title,
        } = todo;

        return (
          <div
            data-cy="Todo"
            className={cn('todo', {
              completed,
            })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
                onClick={async () => {
                  addLoadingTodo(id);
                  await changeTodoCompleted(id, {
                    completed: !completed,
                  });
                }}
              />
            </label>

            {selectedTodoId === id && !isAdding
              ? (
                <form onSubmit={(event) => {
                  if (input.length) {
                    handleFormSubmit(event);
                    addLoadingTodo(id);
                    setSelectedTodoId(0);
                  } else {
                    addLoadingTodo(id);
                    setSelectedTodoId(0);
                    deleteTodo(id, true);
                  }
                }}
                >
                  <input
                    type="text"
                    className="todoapp__change-todo"
                    placeholder="Empty todo will be deleted"
                    value={input}
                    onChange={event => {
                      setInput(event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setSelectedTodoId(0);
                      }
                    }}
                  />
                </form>
              )
              : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setInput(title);
                    setSelectedTodoId(id);
                  }}
                >
                  {title}
                </span>
              )}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={async () => {
                addLoadingTodo(id);
                await deleteTodo(id, true);
              }}
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
            {loadingTodos.includes(id) && (
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};
