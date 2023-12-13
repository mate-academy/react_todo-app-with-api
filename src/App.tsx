/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useMemo, useState } from 'react';
import classNames from 'classnames';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodosContext } from './TodosContext';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoForm } from './components/TodoForm/TodoForm';

export const App: React.FC = () => {
  const [filter, setFilter] = useState(Filter.ALL);

  const todosContext = useContext(TodosContext);

  const {
    todos,
    tempTodo,
    errorMessage,
    setError,
    getFilteredTodos,
    todoCount,
    toggleAll,
    clearCompleted,
  } = todosContext;

  const filteredTodos: Todo[] = useMemo(() => {
    return getFilteredTodos(filter);
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: !todoCount },
              )}
              onClick={() => toggleAll()}
              data-cy="ToggleAllButton"
              disabled={!todos.length}
            />
          )}

          <TodoForm />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
            />

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
              />
            )}

            {/* Hide the footer if there are no todos */}
            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {`${todoCount} items left`}
                </span>

                <TodoFilter
                  filter={filter}
                  setFilter={setFilter}
                />

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={clearCompleted}
                  data-cy="ClearCompletedButton"
                  disabled={todoCount === todos.length}
                >
                  Clear completed
                </button>

              </footer>
            )}
          </>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(ErrorMessage.none)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
