import { useContext } from 'react';
import { TodosClearAll } from './TodosClearAll';
import { TodosFilters } from './TodosFilters';
import { TodosContext } from './TodosContext';

export const TodosControls: React.FC = () => {
  const { active } = useContext(TodosContext);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${active} items left`}
      </span>
      <TodosFilters />
      <TodosClearAll />
    </footer>
  );
};
