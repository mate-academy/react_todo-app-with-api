import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: string;
  changeFilter: (string: string) => void;
  tempTodo: Todo | null;
  deleteTodo: (number: number) => void;
  deleteCompleted: () => void;
  switchTodoStatus: (todo: Todo) => void;
  todoEditedId: number;
  setTodoEditedId: (number: number) => void;
  changeTitle: (todo: Todo, newTitle: string) => void;
  updateOverlay: number
}

export const TodoList: React.FC<Props> = ({
  todos,
  filteredTodos,
  filter,
  changeFilter,
  tempTodo,
  deleteTodo,
  deleteCompleted,
  switchTodoStatus,
  todoEditedId,
  setTodoEditedId,
  changeTitle,
  updateOverlay,
}) => {
  const todosRemaining = todos.reduce((acc, val) => {
    if (!val.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const [editedTitle, setEditedTitle] = useState('');

  const callbackRef = useCallback((inputElement: HTMLInputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const handleTitleEdit = (todo: Todo) => {
    if (editedTitle === todo.title) {
      setTodoEditedId(0);
      setEditedTitle('');

      return;
    }

    if (editedTitle === '') {
      deleteTodo(todo.id);

      return;
    }

    changeTitle(todo, editedTitle);
  };

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
          <div
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  switchTodoStatus(todo);
                }}
              />
            </label>

            {todo.id === todoEditedId
              ? (
                <form
                  onBlur={() => {
                    handleTitleEdit(todo);
                    setTodoEditedId(0);
                  }}
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleTitleEdit(todo);
                  }}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editedTitle}
                    ref={callbackRef}
                    onChange={(event) => setEditedTitle(event.target.value)}
                    onKeyUp={(event) => {
                      if (event.key === 'Escape') {
                        setTodoEditedId(0);
                        setEditedTitle('');
                      }
                    }}
                  />
                </form>
              )
              : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClickCapture={() => {
                      setTodoEditedId(todo.id);
                      setEditedTitle(todo.title);
                    }}
                  >
                    {todo.title}
                  </span>

                  {/* Remove button appears only on hover */}
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

            {/* overlay will cover the todo while it is being updated */}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay',
                { 'is-active': updateOverlay === todo.id })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

        {tempTodo
        && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo?.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            {/* 'is-active' class puts this modal on top of the todo */}
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>

      {todos.length > 0
        && (
          <footer className="todoapp__footer" data-cy="Footer">
            {/* Hide the footer if there are no todos */}
            <span className="todo-count" data-cy="TodosCounter">
              {`${todosRemaining} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', { selected: filter === 'All' })}
                data-cy="FilterLinkAll"
                onClick={() => changeFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn(
                  'filter__link',
                  { selected: filter === 'Active' },
                )}
                data-cy="FilterLinkActive"
                onClick={() => changeFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link',
                  { selected: filter === 'Completed' })}
                data-cy="FilterLinkCompleted"
                onClick={() => changeFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => deleteCompleted()}
              disabled={todos.every(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
    </>
  );
};
