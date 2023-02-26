import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  inputValue: string;
  tempTodo: Todo | null;
  onChangeTodoInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpdateAllTodosStatus: () => void;
  areAllTodosCompleted: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  inputValue,
  tempTodo,
  onChangeTodoInput,
  onSubmitTodo,
  onUpdateAllTodosStatus,
  areAllTodosCompleted,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: areAllTodosCompleted })}
        onClick={onUpdateAllTodosStatus}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmitTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={onChangeTodoInput}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
