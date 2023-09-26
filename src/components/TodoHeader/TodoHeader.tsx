import classNames from 'classnames';

import { UseTodosContext } from '../../utils/TodosContext';

import { TodoForm } from '../TodoForm';
import { changeTodo } from '../../api/todos';
import { ErrorMessages } from '../../types/ErrorMessages';

export const TodoHeader = () => {
  const context = UseTodosContext();
  const {
    todos,
    setTodos,
    setLoadingTodos,
    setErrorMessage,
  } = context;

  const currentCompletionStatus = todos.every(({ completed }) => completed);

  const handleToggleAll = async () => {
    const todosToBeChanged = todos
      .filter(({ completed }) => completed === currentCompletionStatus)
      .map(({ id }) => id);
    const requests = todosToBeChanged
      .map(id => changeTodo(id, { completed: !currentCompletionStatus }));

    try {
      setLoadingTodos(todosToBeChanged);
      await Promise.all(requests);

      setTodos(prevState => {
        return prevState.map((todo) => {
          return ({
            ...todo,
            completed: !currentCompletionStatus,
          });
        });
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.CannotUpdate);
    }

    setLoadingTodos([]);
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length) && (
        <button
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
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
