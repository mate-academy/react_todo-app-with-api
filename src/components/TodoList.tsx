import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Form } from './Form';
import { TodoModal } from './TodoModal';

type Props = {
  todos: Todo[],
  onRemove: (todoId: number) => void
  userId: number
  onTodoUpdate: (todo: Todo) => void
  handleStatusUpdate: (todo: Todo) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  userId,
  onTodoUpdate,
  handleStatusUpdate,
}) => {
  const [editing, setEditing] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(0);

  const handleSubmit = (updatedTodo: Todo) => {
    todos.map((todo) => {
      if (todo.id === updatedTodo.id) {
        return updatedTodo;
      }

      return todo;
    });
    onTodoUpdate(updatedTodo);
    setSelectedTodoId(0);
    setEditing(true);
  };

  const handleDoubleClick = (todoId: number) => {
    setEditing(true);
    setSelectedTodoId(todoId);
    setTimeout(() => {
      setEditing(false);
    }, 300);
  };

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label
            className="todo__status-label"
          >
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                handleStatusUpdate(todo);
                setEditing(true);
              }}
            />
          </label>
          {selectedTodoId === todo.id
            ? (
              <>
                <Form
                  todo={todo}
                  onSubmit={handleSubmit}
                  todos={todos}
                  userId={userId}
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                />

                <TodoModal
                  editing={editing}
                />
              </>
            )
            : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    handleDoubleClick(todo.id);
                  }}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => {
                    onRemove(todo.id);
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
