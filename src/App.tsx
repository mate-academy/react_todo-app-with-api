/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as metodosAPI from './api/metodosApi';

export const App: React.FC = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [todoFantasm, setTodoFantasm] = useState<Todo | undefined>(undefined);
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const [deletingTodo, setDeletingTodo] = useState<number>();
  const [updatingTodo, setUpdatingTodo] = useState<number>();
  const [texto, setTexto] = useState<[number, string]>([-1, '']);

  const metodos = {
    setTodo,
    setInputText,
    setErrorMessage,
    setInputDisabled,
    setTodoFantasm,
    setDeletingTodo,
    setUpdatingTodo,
    setTexto,
    newTodoInputRef,
    activeFilter,
    inputText,
    texto,
    todo,
  };

  useEffect(() => {
    metodosAPI.getData({
      setTodo,
      setErrorMessage,
    });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    newTodoInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!inputDisabled) {
      newTodoInputRef.current?.focus();
    }
  }, [inputDisabled]);

  const estadoInput = (todoEnviado: Todo) => {
    setTexto([todoEnviado.id, todoEnviado.title]);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  // The `todo` state always holds the FULL list fetched from the server.
  // Filtering by 'active' / 'completed' happens only here, at render time,
  // so counters, the Toggle All button, and the footer (which all rely on
  // `todo` directly) keep working correctly no matter which filter is
  // currently selected.
  const visibleTodos = todo.filter(item => {
    if (activeFilter === 'active') {
      return !item.completed;
    }

    if (activeFilter === 'completed') {
      return item.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todo.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${
                todo.length > 0 &&
                todo.filter(r => r.completed).length === todo.length
                  ? 'active'
                  : ''
              }`}
              onClick={() => {
                metodosAPI.sendPatchDataForAll(metodos);
              }}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={e => metodosAPI.postData(e, metodos)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputText}
              onChange={e => {
                setInputText(e.target.value);

                if (e.target.value === '') {
                  setErrorMessage('Title should not be empty');
                }
              }}
              disabled={inputDisabled}
              ref={newTodoInputRef}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todoArray => (
            <div
              data-cy="Todo"
              className={`todo ${todoArray.completed ? 'completed' : ''}`}
              key={todoArray.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todoArray.completed}
                  onChange={() => metodosAPI.patchData(todoArray, metodos)}
                />
              </label>

              {texto[0] === todoArray.id ? (
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={texto[1]}
                  onKeyDown={async e => {
                    if (e.key === 'Escape') {
                      setTexto([-1, '']);
                    }

                    if (e.key === 'Enter' && texto[1].trim() === '') {
                      const sucesso = await metodosAPI.deleteData(
                        todoArray.id,
                        metodos,
                      );

                      if (sucesso) {
                        setTexto([-1, '']);
                      }

                      return;
                    }

                    if (e.key === 'Enter') {
                      metodosAPI.updateTodoTitle(todoArray, texto[1], metodos);
                    }
                  }}
                  onBlur={() => {
                    if (texto[1].trim() !== '') {
                      metodosAPI.updateTodoTitle(todoArray, texto[1], metodos);
                    } else {
                      metodosAPI.deleteData(todoArray.id, metodos);
                    }
                  }}
                  onChange={e => setTexto([texto[0], e.target.value])}
                  autoFocus
                />
              ) : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => estadoInput(todoArray)}
                >
                  {todoArray.title}
                </span>
              )}

              {texto[0] !== todoArray.id && (
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => metodosAPI.deleteData(todoArray.id, metodos)}
                >
                  ×
                </button>
              )}

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${
                  deletingTodo === todoArray.id || updatingTodo === todoArray.id
                    ? 'is-active'
                    : ''
                }`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {todoFantasm !== undefined && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todoFantasm.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                x
              </button>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todo.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todo.filter(r => r.completed === false).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${
                  activeFilter === 'all' ? 'selected' : ''
                }`}
                data-cy="FilterLinkAll"
                onClick={() => setActiveFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${
                  activeFilter === 'active' ? 'selected' : ''
                }`}
                data-cy="FilterLinkActive"
                onClick={() => setActiveFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${
                  activeFilter === 'completed' ? 'selected' : ''
                }`}
                data-cy="FilterLinkCompleted"
                onClick={() => setActiveFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todo.filter(r => r.completed).length === 0}
              onClick={() => metodosAPI.deleteCompleted(metodos)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          !errorMessage ? 'hidden' : ''
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
