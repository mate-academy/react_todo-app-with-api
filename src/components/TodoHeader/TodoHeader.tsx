import { ToggleAllButton } from './ToggleAllButton';
import { AddTodoForm } from './AddTodoForm';

export const TodoHeader = () => {
  return (
    <header className="todoapp__header">
      <ToggleAllButton />
      <AddTodoForm />
    </header>
  );
};
