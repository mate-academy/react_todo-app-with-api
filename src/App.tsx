import React, { useState } from 'react';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorsNotification';
import { useTodos } from './hooks/useTodos';

type Sort = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const {
    todos,
    title,
    setTitle,
    tempState,
    loadingIds,
    handleSubmit,
    handleDelete,
    handleUpdate,
    inputRef,
  } = useTodos();
  const [sortBy, setSortBy] = useState<Sort>('All');

  const activeTodo = [...todos].filter(todo => todo.completed === false);
  const completedTodo = [...todos].filter(todo => todo.completed === true);

  let filteredTodos = todos;

  if (sortBy === 'Active') {
    filteredTodos = activeTodo;
  }

  if (sortBy === 'Completed') {
    filteredTodos = completedTodo;
  }
  //   const completedTodo: Todo[] = todos.map(todo => {
  //     if (todo.id === id) {
  //       setLoadingIds([...loadingIds, todo.id]);

  //       return {
  //         ...todo,
  //         completed: !todo.completed,
  //       };
  //     }

  //     setTimeout(() => {
  //       const loading = loadingIds.filter(item => {
  //         return item !== todo.id;
  //       });

  //       setLoadingIds(loading);
  //     }, 500);

  //     return todo;
  //   });

  //   setTodos(completedTodo);
  // };

  // console.log(handleCompltete);

  const handleToggleStatus = (todo: Todo) => {
    handleUpdate({ ...todo, completed: !todo.completed });
  };

  const handleToggleAllStatus = () => {
    if (activeTodo.length > 0) {
      activeTodo.forEach(item => handleToggleStatus(item));
    } else {
      completedTodo.forEach(item => handleToggleStatus(item));
    }
  };

  const handleRename = (todo: Todo) => {
    handleUpdate(todo);
  };

  const handleDeleteCompleted = () => {
    const deletedIds = completedTodo.map(todo => todo.id);

    deletedIds.forEach(id => handleDelete(id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.length === completedTodo.length,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllStatus}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value.trimStart())}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            return (
              <TodoItem
                todo={todo}
                loadingIds={loadingIds}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onRename={handleRename}
                key={todo.id}
              />
            );
          })}
          {tempState && <TodoItem todo={tempState} loadingIds={[0]} />}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodo.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', { selected: sortBy === 'All' })}
                data-cy="FilterLinkAll"
                onClick={() => setSortBy('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: sortBy === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setSortBy('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: sortBy === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setSortBy('Completed')}
              >
                Completed
              </a>
            </nav>

            {completedTodo.length === 0 ? (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled
              >
                Clear completed
              </button>
            ) : (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleDeleteCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
