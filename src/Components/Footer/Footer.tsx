import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosType } from '../../enums/TodosType';
import {
  Actions,
  DispatchContext,
} from '../Store';
import { Todo } from '../../types/Todo';
import { deleteData } from '../../api/todos';

interface Props {
  completedTodos: Todo[],
  activeTodos: Todo[],
  setErrorMessage: (msg: string) => void,
  visibleTodosType: TodosType,
  setVisibleTodosType: (type: TodosType) => void,
}

export const Footer: React.FC<Props> = ({
  completedTodos,
  activeTodos,
  setErrorMessage,
  visibleTodosType,
  setVisibleTodosType,
}) => {
  const dispatch = useContext(DispatchContext);
  const itemsLeft = activeTodos.length === 1
    ? `${activeTodos.length} item left`
    : `${activeTodos.length} items left`;

  const destroyCompletedTodos = () => {
    completedTodos.forEach((todo) => {
      deleteData(todo.id)
        .then(() => {
          dispatch({
            type: Actions.destroy,
            todo,
          });
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        });
    });
  };

  const setAllTodosVisible = () => {
    setVisibleTodosType(TodosType.all);
  };

  const setActiveTodosVisible = () => {
    setVisibleTodosType(TodosType.active);
  };

  const setComplitedTodosVisible = () => {
    setVisibleTodosType(TodosType.completed);
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
          className={cn('filter__link', {
            selected: visibleTodosType === TodosType.all,
          })}
          onClick={setAllTodosVisible}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: visibleTodosType === TodosType.active,
          })}
          data-cy="FilterLinkActive"
          onClick={setActiveTodosVisible}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: visibleTodosType === TodosType.completed,
          })}
          onClick={setComplitedTodosVisible}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={destroyCompletedTodos}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
