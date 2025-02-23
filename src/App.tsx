import React, { useState } from 'react';
import { Todo } from './types/Todo';
import cn from 'classnames';
// import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorsNotification';
import { useTodos } from './hooks/useTodos';
import { Sort } from './types/Sort';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';

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

  const [sortBy, setSortBy] = useState<Sort>(Sort.all);

  const { filteredTodos, activeTodo, completedTodo } = getFilteredTodos(
    todos,
    sortBy,
  );

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

        <TodoList
          filteredTodos={filteredTodos}
          loadingIds={loadingIds}
          handleDelete={handleDelete}
          handleToggleStatus={handleToggleStatus}
          handleRename={handleRename}
          tempState={tempState}
        />

        {todos.length > 0 && (
          <Footer
            activeTodo={activeTodo}
            completedTodo={completedTodo}
            onDeleteCompleted={handleDeleteCompleted}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
