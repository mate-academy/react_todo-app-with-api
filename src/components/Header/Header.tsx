import cn from 'classnames';
import { useTodos } from '../../context/TodosContext';
import { TodosForm } from '../TodosForm';

export const Header: React.FC = () => {
  const { todos, handleToggleTodoCheck } = useTodos();

  const isAllTodosActive = todos.every(todo => todo.completed);

  const handleToggleAllTodoCheck = () => {
    if (!isAllTodosActive) {
      todos
        .filter(({ completed }) => !completed)
        .forEach(todo => {
          handleToggleTodoCheck(todo.id, todo, true);
        });
    } else {
      todos.forEach(todo => {
        handleToggleTodoCheck(todo.id, todo, false);
      });
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          onClick={handleToggleAllTodoCheck}
          aria-label="toggle all active todos"
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllTodosActive })}
          data-cy="ToggleAllButton"
        />
      )}

      <TodosForm />
    </header>
  );
};
