import classNames from 'classnames';
import { useTodosProvider } from '../../providers/TodosContext';
import { Form } from './Form/Form';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC = () => {
  const { todos, handleToggleAllComplete } = useTodosProvider();

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllComplete}
        />
      )}

      <Form />
    </header>
  );
};
