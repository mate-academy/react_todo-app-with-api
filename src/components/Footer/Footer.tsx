import { ClearButton } from './ClearButton';
import { Filter } from './Filter';
import { TodoCount } from './TodoCount';

export const Footer: React.FC = () => {
  return (
    <footer className="todoapp__footer">
      <TodoCount />
      <Filter />
      <ClearButton />
    </footer>
  );
};
