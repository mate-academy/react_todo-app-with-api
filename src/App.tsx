import { useContext, useEffect, useMemo } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID } from './constans';
import { TodosContext } from './store/TodosContext';
import { getToggleAll, getTodos } from './utils/todoUtils';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoForm } from './components/TodoForm';

export const App = () => {
  /* eslint-disable react-hooks/rules-of-hooks */
  if (!USER_ID) {
    return <UserWarning />;
  }

  const {
    todos,
    tempTodo,
    deletedTodosId,
    updateTodos,
    titleField,
    loadTodos,
  } = useContext(TodosContext);

  useEffect(loadTodos, [loadTodos]);

  const IsEveryCompletedTodos = useMemo(
    () => getTodos.isEveryCompleted(todos),
    [todos],
  );

  const toggleAll = useMemo(() => getToggleAll(todos), [todos]);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [tempTodo, deletedTodosId, titleField]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: IsEveryCompletedTodos,
              })}
              data-cy="ToggleAllButton"
              onClick={() => updateTodos(toggleAll)}
            />
          )}
          <TodoForm />
        </header>

        {!!todos.length && (
          <>
            <TodoList />

            <TodoFilter />
          </>
        )}
      </div>

      <ErrorMessage />
    </div>
  );
};
