import cn from 'classnames';

import { PostForm } from '../PostForm';
import { Todo } from '../../types/Todo';
import { TodoError } from '../../types/TodoError';

type Props = {
  hasEveryCompletedTodo: boolean;
  onSubmit: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (todoError: TodoError) => void;
  loading: boolean;
  todos: Todo[];
  onUpdate: (updatedTodo: Todo) => void;
};

export const Header: React.FC<Props> = ({
  hasEveryCompletedTodo,
  onSubmit,
  setErrorMessage,
  loading,
  todos,
  onUpdate,
}) => {
  const activeTodos = todos.filter(({ completed }) => !completed);

  const completeAllActive = () => {
    const processedTodos = activeTodos.length ? activeTodos : todos;

    for (const todo of processedTodos) {
      onUpdate({ ...todo, completed: !todo.completed });
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: hasEveryCompletedTodo,
          })}
          data-cy="ToggleAllButton"
          aria-label="toggle-all-button"
          onClick={completeAllActive}
        />
      )}

      <PostForm
        onSubmit={onSubmit}
        setErrorMessage={setErrorMessage}
        loading={loading}
      />
    </header>
  );
};
