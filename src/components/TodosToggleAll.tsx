import { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from './TodosContext';

export const TodosToggleAll: React.FC = () => {
  const { todos, active, doUpdate } = useContext(TodosContext);
  const isAlldone = todos.length - active === todos.length;

  const handleToggleAll = () => {
    const requestedState = !isAlldone;

    todos
      .filter(todo => todo.completed !== requestedState)
      .forEach(todo => doUpdate({ ...todo, completed: !todo.completed }));
  };

  return (
    <button
      type="button"
      className={classNames(
        'todoapp__toggle-all', { active: isAlldone },
      )}
      data-cy="ToggleAllButton"
      aria-label="ToggleAll"
      onClick={handleToggleAll}
    />
  );
};
