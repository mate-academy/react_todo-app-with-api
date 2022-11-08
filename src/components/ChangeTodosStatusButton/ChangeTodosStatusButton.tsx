import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  loadTodos: () => Promise<void>;
  changeTodoStatus: (todoId: number, status: boolean) => Promise<void>;
};

export const ChangeTodosStatusButton: React.FC<Props> = ({
  todos,
  loadTodos,
  changeTodoStatus,
}) => {
  const isAllCompleted = todos.every(({ completed }) => completed);

  const changeAllTodosStatus = async () => {
    if (!isAllCompleted) {
      await Promise.all(todos.map(({ id, completed }) => {
        if (!completed) {
          return changeTodoStatus(id, !completed);
        }

        return null;
      }));
    } else {
      await Promise.all(todos.map(({ id, completed }) => {
        return changeTodoStatus(id, !completed);
      }));
    }
  };

  const handleChangingAllTodosStatus = async () => {
    await changeAllTodosStatus();
    await loadTodos();
  };

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      data-cy="ToggleAllButton"
      type="button"
      className={cn(
        'todoapp__toggle-all',
        { active: isAllCompleted },
      )}
      onClick={handleChangingAllTodosStatus}
    />
  );
};
