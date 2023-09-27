import { useTodo } from '../../context/TodoContext';
import { ToggleButton } from './ToggleButton';
import { Input } from './Input';

export const Header = () => {
  const {
    todos,
  } = useTodo();

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <ToggleButton />
      )}
      <Input />
    </header>
  );
};
