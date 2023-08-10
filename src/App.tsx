import { useState } from 'react';

import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Filters, TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoError } from './components/TodoError/TodoError';
import { useTodos } from './contexts/todosContext';

type AppProps = {
  userId: number;
};

export const App = ({ userId }: AppProps) => {
  const [activeFilter, setActiveFilter] = useState<Filters>('all');
  const { todosMap, error, handleToggleCompletedAll } = useTodos();

  const filteredTodos = todosMap[activeFilter];
  const { completed, active } = todosMap;

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: active.length <= 0,
            })}
            aria-label="Toggle all todos"
            onClick={handleToggleCompletedAll}
          />

          <TodoForm />
        </header>

        <TodoList todos={filteredTodos} />

        {todosMap.all.length > 0 && (
          <TodoFilter
            activeFilter={activeFilter}
            changeFilter={setActiveFilter}
            activeTodosCount={active.length}
            completedTodosCount={completed.length}
          />
        )}
      </div>

      {error && <TodoError errorMsg={error} />}
    </div>
  );
};
