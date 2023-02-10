import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { Form } from './Form';
import { Loader } from './Loader';

type Props = {
  todos: Todo[],
  onTodoDelete: (todoId: number) => void
  onTodoUpdate: (todo: Todo) => void
  todosBeingTransform: number[],
  setSelectedTodoId: (number: number) => void
  selectedTodoId: number | null
  userID: number,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  onTodoUpdate,
  todosBeingTransform,
  setSelectedTodoId,
  selectedTodoId,
  userID,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <div
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label
            className="todo__status-label"
          >
            {todosBeingTransform.includes(todo.id) && (
              <Loader />
            )}
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                onTodoUpdate({
                  ...todo,
                  completed: !todo.completed,
                });
              }}
            />
          </label>
          {selectedTodoId
            ? (
              <Form
                todo={todo}
                onSubmit={() => { }}
                userId={userID}
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
              />
            )
            : (
              <>
                <span
                  key={todo.id}
                  className="todo__title"
                  onDoubleClick={() => {
                    setSelectedTodoId(todo.id);
                  }}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => {
                    onTodoDelete(todo.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
        </div>
      ))}
    </section>
  );
};
