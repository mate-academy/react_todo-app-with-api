import { useTodoContext } from '../../../Context/Context';
import { TodoForm } from '../TodoForm/TodoForm';
import { ToggleButton } from '../ToggleButton/ToggleButton';

export const TodoHeader = () => {
  const { renderedTodos } = useTodoContext();

  return (
    <header className="todoapp__header">
      {renderedTodos.length !== 0 && <ToggleButton />}
      <TodoForm />
    </header>
  );
};
