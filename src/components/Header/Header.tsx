import { NewTodoForm } from '../NewTodoForm/NewTodoForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  handleErrorNotification,
  updateTodoCheckStatus,
} from '../../features/todosSlice';

export const Header: React.FC = () => {
  const todos = useAppSelector(state => state.todos.items);
  const dispatch = useAppDispatch();

  const allChecked = todos.every(todo => todo.completed);

  const toggleAllCheckedOnServer = () => {
    return todos.forEach(todo => {
      if (todo.completed === !allChecked) {
        return;
      }

      dispatch(updateTodoCheckStatus({ ...todo, completed: !allChecked }));
      setTimeout(() => dispatch(handleErrorNotification('')), 3000);
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
      <NewTodoForm />
    </header>
  );
};
