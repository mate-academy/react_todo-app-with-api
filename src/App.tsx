/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import { AddTodoForm } from './components/AddTodoForm';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/FIlterTypes';
import { UserWarning } from './UserWarning';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodosContext } from './components/TodosProvider';
import { Loader } from './components/Loader';

export const App: React.FC = () => {
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);
  const {
    todos,
    USER_ID,
    activeTodos,
    handleToggleAll,
    isLoading,
  } = useContext(TodosContext);

  const hasActiveTodos = activeTodos.length > 0;

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  const handleFilterType = useCallback((filter: FilterTypes) => {
    setFilterType(filter);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading
        ? <Loader />
        : (
          <div className="todoapp__content">
            <header className="todoapp__header">
              <button
                type="button"
                className={cn('todoapp__toggle-all', {
                  active: !hasActiveTodos,
                })}
                onClick={handleToggleAll}
              />

              <AddTodoForm />
            </header>

            {!!todos.length && (
              <>
                <TodoList
                  todos={visibleTodos}
                />

                <Footer
                  filterType={filterType}
                  handleFilterType={handleFilterType}
                  activeTodos={activeTodos}
                />
              </>
            )}
          </div>
        )}

      <Notification />
    </div>
  );
};
