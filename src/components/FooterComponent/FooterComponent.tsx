import classNames from 'classnames';

import { useContext } from 'react';
import { AppContext } from '../../context';
import { deleteTodo } from '../../api/todos';
import {
  removeUpdatedTodoIdAction,
  setUpdatedTodoIdAction,
} from '../../services/actions/updatedTodoIdActions';
import { deleteTodoAction } from '../../services/actions/todoActions';
import { setErrorMessageAction } from '../../services/actions/errorActions';
import { Statuses } from '../../enums/Statuses';
import { Types } from '../../enums/Types';

export const FooterComponent:React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { filter, todos } = state;

  const isShowingClearBtn = (
    () => (state.itemsLeft() !== state.todos.length)
  )();

  const filterBy = (
    e:React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    filterByStatus: Statuses,
  ) => {
    e.preventDefault();
    dispatch({
      type: Types.FilterBy,
      payload: {
        filterBy: filterByStatus,
      },
    });
  };

  const clearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (!completed) {
        return;
      }

      dispatch(setUpdatedTodoIdAction(id));

      deleteTodo(id)
        .then(() => {
          dispatch(deleteTodoAction(id));
        })
        .catch(() => {
          if (!state.errorMessage) {
            dispatch(setErrorMessageAction('Can\'t delete a todo'));
          }
        })
        .finally(() => {
          dispatch(removeUpdatedTodoIdAction(id));
        });
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${state.itemsLeft()} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Statuses.All },
          )}
          onClick={(e) => filterBy(e, Statuses.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Statuses.Active },
          )}
          onClick={(e) => filterBy(e, Statuses.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Statuses.Completed },
          )}
          onClick={(e) => filterBy(e, Statuses.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        disabled={!isShowingClearBtn}
        style={{
          opacity: isShowingClearBtn ? '100' : '0',
          cursor: isShowingClearBtn ? 'pointer' : 'default',
        }}
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
