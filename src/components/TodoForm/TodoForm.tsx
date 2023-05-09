/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  amountActiveTodos: number,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void,
  handleToggleStatusTodos: () => void,
  actionsTodosId: number[] | [],
  todos: Todo[] | [],
  formInputRef: React.RefObject<HTMLInputElement>,
};

export const TodoForm: React.FC<Props> = ({
  amountActiveTodos,
  value,
  setValue,
  handleAddTodo,
  handleToggleStatusTodos,
  actionsTodosId,
  todos,
  formInputRef,
}) => (
  <header className="todoapp__header">
    {!!todos.length && (
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: !amountActiveTodos,
          },
        )}
        onClick={handleToggleStatusTodos}
      />
    )}

    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!!actionsTodosId.length}
        ref={formInputRef}
      />
    </form>
  </header>
);
