import { FC, ChangeEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/types';

type Props = {
  handleTodoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTodoSubmit: (event: ChangeEvent<HTMLFormElement>) => void;
  task: string;
  isDataUpdated: boolean;
  handleChangeCompletedAll: () => void;
  isAllTodosCompleted: boolean;
  todos: Todo[];
};

export const NewTodo: FC<Props> = ({
  handleTodoChange,
  handleTodoSubmit,
  task,
  isDataUpdated,
  handleChangeCompletedAll,
  isAllTodosCompleted,
  todos,
}) => (
  <header className="todoapp__header">
    {todos && (
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        onClick={handleChangeCompletedAll}
        aria-label="Mute volume"
      />
    )}

    <form onSubmit={handleTodoSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handleTodoChange}
        value={task}
        disabled={isDataUpdated && !!task}
      />
    </form>
  </header>
);
