import cn from 'classnames';
/* eslint-disable max-len */
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Error';

interface Props {
  clickHandler: (value: Filter) => void
  activeFilter: Filter
  displayTodos: Todo[]
  setcleared: (value: boolean) => void
  setTodos: (newTodos: Todo[] | ((prevValue: Todo[]) => Todo[])) => void
  todos: Todo[]
  setError: (value: string) => void
  titleField: React.MutableRefObject<HTMLInputElement | null>;
}

export const Footer: React.FC<Props> = ({
  clickHandler,
  activeFilter,
  displayTodos,
  setcleared,
  setTodos,
  setError,
  titleField,

}) => {
  const incompletedAmount = displayTodos.filter(todo => !todo.completed).length;
  const completed = displayTodos.filter(todo => todo.completed).length;

  const clearCompleted = () => {
    const toClear = displayTodos.filter((todo: Todo) => todo.completed);

    toClear.forEach(todo => {
      if (todo.id) {
        setcleared(true);
        deleteTodo(todo.id)
          .then(() => {
            setTodos((prevtodos:Todo[]) => prevtodos.filter((todoo: Todo) => todoo.id !== todo.id));
            
              titleField?.current?.focus();
            
          })
          .catch(() => setError(Errors.unableDelete))
          .finally(() => setcleared(false));
      }
    });
  };

  

  
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${incompletedAmount} items left`}
      </span>

      
      
      
      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => clickHandler(Filter.all)}
          href="#/"
          className={
            cn(
              'filter__link', {
                selected: activeFilter === Filter.all,
              },
            )
          }
          data-cy="FilterLinkAll"
        >
          {Filter.all}
        </a>

        <a
          href="#/active"
          className={
            cn(
              'filter__link', {
                selected: activeFilter === Filter.active,
              },
            )
          }
          data-cy="FilterLinkActive"
          onClick={() => clickHandler(Filter.active)}
        >
          {Filter.active}
        </a>

        <a
          href="#/completed"
          className={
            cn(
              'filter__link', {
                selected: activeFilter === Filter.completed,
              },
            )
          }
          data-cy="FilterLinkCompleted"
          onClick={() => clickHandler(Filter.completed)}
        >
          {Filter.completed}
        </a>
      </nav>

      <button
        onClick={clearCompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={(completed === 0)}
      >
        Clear completed
      </button>
    </footer>
  );
};
