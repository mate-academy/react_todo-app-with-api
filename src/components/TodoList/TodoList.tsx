import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  handleDeleteTodo: (todo: number) => void;
  handleComplitedTodo: (todoId: number, toggle: boolean) => void;
  editingTodosId: number[];
  formShowedForId: number;
  showForm: (todoId: number) => void;
  handleUpdateTodoTitle: (todoId: number, newTitle: string) => void,
  tempTodo: Todo | null,
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleComplitedTodo,
  editingTodosId,
  formShowedForId,
  showForm,
  handleUpdateTodoTitle,
  tempTodo,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleTitleChange = (todo: Todo) => {
    if (newTitle === todo.title) {
      showForm(0);
      setNewTitle('');
    } else if (!newTitle.trim()) {
      handleDeleteTodo(todo.id);
    } else {
      handleUpdateTodoTitle(todo.id, newTitle);
      showForm(0);
    }
  };

  const cancelTitleCahnge = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      showForm(0);
      setNewTitle('');
    }
  };

  const tempTodoItem = (
    <div
      className="todo"
    >
      <label className="todo__status-label">

        <input
          type="checkbox"
          className="todo__status"
        />

      </label>

      <span className="todo__title">
        {tempTodo?.title}
      </span>

      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );

  return (
    <section className="todoapp__main">

      {todos.map(todo => {
        const formTitleChange = formShowedForId === todo.id
          ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                handleTitleChange(todo);
              }}
            >
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                onBlur={() => handleTitleChange(todo)}
                onKeyDown={event => cancelTitleCahnge(event)}
              />
            </form>
          ) : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => {
                  setNewTitle(todo.title);
                  showForm(todo.id);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          );

        return (
          <div
            className={cn('todo', {
              completed: todo.completed,
            })}
            key={todo.id}
          >
            <label className="todo__status-label">

              <input
                type="checkbox"
                className="todo__status"
                defaultChecked={todo.completed}
                onClick={() => handleComplitedTodo(todo.id, todo.completed)}
              />

            </label>

            {formTitleChange}

            <div className={cn('modal', 'overlay', {
              'is-active': editingTodosId.includes(todo.id),
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && tempTodoItem}

    </section>
  );
};
