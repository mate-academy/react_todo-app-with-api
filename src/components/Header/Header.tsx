/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  name: string,
  setName: (event: string) => void,
  handleAddTodo: (todoName: string) => void,
  isDisableInput: boolean,
  toggleAll: () => void,
  setLoadingForToggle: (s: boolean) => void,
};
export const Header:React.FC<Props> = ({
  todos,
  name,
  setName,
  handleAddTodo,
  isDisableInput,
  toggleAll,
  setLoadingForToggle,
}) => {
  const isActive = todos.filter(todo => !todo.completed).length > 0;
  const trimedName = name.trimStart();

  return (
    <header className="todoapp__header">
      {todos.length > 0
      && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: !isActive })}
          onClick={() => {
            toggleAll();
            setLoadingForToggle(true);
          }}
        />
      ) }

      {/* Add a todo on form submit */}
      <form onSubmit={(event) => {
        event.preventDefault();
        handleAddTodo(name);
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={trimedName}
          onChange={event => setName(event.target.value)}
          disabled={isDisableInput}
        />
      </form>
    </header>
  );
};
