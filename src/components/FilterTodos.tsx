import classNames from 'classnames';
import { Selected } from '../types/Selected';

type Props = {
  amountActive: number;
  completTodos: boolean;
  selected: Selected;
  setSelected: (select: Selected) => void;
  clearCompleted: () => void;
};

const filtersSelected = [
  { type: Selected.ALL },
  { type: Selected.ACTIVE },
  { type: Selected.COMPLETED },
];

export const FilterTodos: React.FC<Props> = ({
  amountActive, completTodos, selected, setSelected, clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${amountActive} items left`}
      </span>

      <nav className="filter">

        {filtersSelected.map(({ type }) => (
          <a
            key={type}
            href={`#/${type}`}
            className={
              classNames('filter__link',
                { selected: selected === type })
            }
            onClick={() => setSelected(type)}
          >
            {`${type[0].toLocaleUpperCase() + type.slice(1)}`}
          </a>

        ))}
      </nav>

      <button
        className="todoapp__clear-completed"
        style={{ visibility: completTodos ? 'visible' : 'hidden' }}
        type="button"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
