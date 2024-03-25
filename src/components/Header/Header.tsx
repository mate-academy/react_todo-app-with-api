import { useTodosContext } from '../../hooks/useTodosContext';
import { AddTodoForm } from '../AddTodoForm';
import { ToggleAllButton } from '../ToggleAllButton';

export const Header: React.FC = () => {
  const { todos } = useTodosContext();

  return (
    <header className="todoapp__header">
      {todos.length > 0 && <ToggleAllButton />}
      <AddTodoForm />
    </header>
  );
};
