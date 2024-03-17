import classNames from 'classnames';
import React, { useContext } from 'react';
import { Filtering } from '../../types/Filtering';
import { MyContext, MyContextData } from '../context/myContext';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

interface Props {
  filterType: Filtering;
}

export const Footer: React.FC<Props> = ({ filterType }) => {
  const {
    reducer,
    loading,
    handleSetFilterType,
    handleSetLoading,
    handleSetError,
    focusField,
  } = useContext(MyContext) as MyContextData;
  const { state, remove } = reducer;

  const itemsLeft = `${state.length - state.filter((elem: Todo) => elem.completed).length} items left`;
  const hasCompletedItems = state.find(elem => elem.completed);

  const deleteAllCompleted = () => {
    state.forEach(todo => {
      if (todo.completed) {
        handleSetLoading([...loading, todo.id as number]);
        deleteTodo(todo.id as number)
          .then(() => {
            remove(todo.id as number);
          })
          .catch(() => {
            handleSetError('Unable to delete a todo');
          })
          .finally(() => {
            setTimeout(() => {
              focusField();
            }, 0);
            handleSetLoading(loading.filter(elem => elem !== todo.id));
          });
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filterType === Filtering.All,
          })}
          onClick={() => handleSetFilterType(Filtering.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === Filtering.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleSetFilterType(Filtering.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === Filtering.Complete,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleSetFilterType(Filtering.Complete)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedItems}
        onClick={() => deleteAllCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
