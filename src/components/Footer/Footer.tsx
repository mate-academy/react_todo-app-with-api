import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext';
import { FilterOption, OPTIONS, filterTodos } from '../../utils/variables';

export const Footer = () => {
  const {
    todos,
    setFilteredTodos,
    handleRemoveTodo,
    isTodoChange,
    changingItems,
  } = useContext(TodosContext);
  const [selectedOption, setSelectedOption] = useState(FilterOption.Default);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    setSelectedOption(FilterOption.All);
  }, []);

  useEffect(() => {
    setFilteredTodos(filterTodos(selectedOption, todos));
    setHasCompleted(todos.some(todo => todo.completed));
  }, [selectedOption, isTodoChange, changingItems]);

  const handleFilterTodos = (option: FilterOption) => {
    setSelectedOption(option);
  };

  const removeAllCompletedTodos = () => {
    const completedTodos = filterTodos(FilterOption.Completed, todos);

    completedTodos.forEach(todo => handleRemoveTodo(todo));
    setHasCompleted(false);
  };

  const counterTodos = todos.filter(todo => !todo.completed).length;

  const item = counterTodos === 1
    ? 'item'
    : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counterTodos} ${item} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {OPTIONS.map(option => {
          const isSelected = selectedOption === option;

          return (
            <a
              key={option}
              href={`#/${option.toLowerCase()}`}
              data-cy={`FilterLink${option}`}
              className={cn(
                'filter__link',
                { selected: isSelected },
              )}
              onClick={() => handleFilterTodos(option)}
            >
              {option}
            </a>
          );
        })}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompleted}
        onClick={removeAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
