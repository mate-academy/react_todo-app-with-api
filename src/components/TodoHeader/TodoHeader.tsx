import { TodoInput } from './TodoInput';
import { TodoToggleAll } from './TodoToggleAll';

type Props = {
  handleToggle: () => void;
};

export const TodoHeader: React.FC<Props> = ({ handleToggle }) => {
  return (
    <header className="todoapp__header">
      <TodoToggleAll
        handleToggle={handleToggle}
      />

      <TodoInput />
    </header>
  );
};
