import classNames from 'classnames';

import { UseTodosContext } from '../../utils/TodosContext';

import { TodoForm } from '../TodoForm';

export const TodoHeader = () => {
  const context = UseTodosContext();
  const {
    todos,
    isAllCompleted,
    setIsAllCompleted,
  } = context;

  const currentCompletionStatus = todos.every(({ completed }) => completed);

  const changeAllTodosStatus = () => {
    if (isAllCompleted || currentCompletionStatus) {
      setIsAllCompleted(false);

      return;
    }

    setIsAllCompleted(true);
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length) && (
        <button
          data-cy="ToggleAllButton"
          onClick={changeAllTodosStatus}
          type="button"
          aria-label="change todo status"
          className={classNames('todoapp__toggle-all', {
            active: currentCompletionStatus,
          })}
        />
      )}

      <TodoForm />
    </header>
  );
};
