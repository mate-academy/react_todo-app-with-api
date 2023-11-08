import { ClearButton } from './ClearButton';
import { Filters } from './Filters';
import { TodosCounter } from './TodosCounter';

export const Footer = () => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <TodosCounter />

      <Filters />

      <ClearButton />
    </footer>
  );
};
