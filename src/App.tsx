import React, { useContext, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { TodoList } from './сomponents/TodoList/TodoList';
import { TodosFilter } from './сomponents/TodoFilter/TodoFilter';
import { TodoForm } from './сomponents/TodoForm/TodoForm';
import { TodoItem } from './сomponents/TodoItem/TodoItem';
import { TodosContext } from './TodosContext';
import { ErrorMessage } from './types/ErrorMessage';

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
              aria-label="button"
              type="button"
              className={classNames('todoapp__toggle-all',
                { active: !todoCount })}
              data-cy="ToggleAllButton"
              disabled={!todos.length}
              onClick={() => toggleAll()}
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

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {`${todoCount} items left`}
                </span>

                <TodosFilter
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
          aria-label="button"
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
