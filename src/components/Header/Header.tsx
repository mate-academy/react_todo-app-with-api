import { TodoForm } from '../TodoForm/TodoForm';
import { useDispatch, useGlobalState } from '../../GlobalStateProvider';
import { Type } from '../../types/Action';
import { Todo } from '../../types/Todo';

type Props = {
  handleError: (message: string) => void;
  updateTodoCheckOnServer: (arg: Todo) => void;
};

export const Header: React.FC<Props> = ({
  handleError,
  updateTodoCheckOnServer,
}) => {
  const { todos } = useGlobalState();
  const dispatch = useDispatch();

  const allChecked = todos.every(todo => todo.completed);

  const toggleAllCheckedOnServer = () => {
    return todos.forEach(todo => {
      if (todo.completed === !allChecked) {
        return;
      }

      dispatch({ type: Type.setLoadingTodos, payload: todo.id });
      updateTodoCheckOnServer({ ...todo, completed: !allChecked });
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length >= 1 && (
        <button
          type="button"
          className={'todoapp__toggle-all ' + (allChecked ? 'active' : '')}
          data-cy="ToggleAllButton"
          onClick={toggleAllCheckedOnServer}
        />
      )}
      <TodoForm handleError={handleError} />
    </header>
  );
};
