import React, { useContext } from 'react';
import classNames from 'classnames';
import { StatusType } from '../../types/Status';
import { DispatchContext, StateContext } from '../StateProvider';
import * as todoService from '../../api/todos';

const filterOptions = [
  {
    label: StatusType.All,
    href: '#/',
  },
  {
    label: StatusType.Active,
    href: '#/active',
  },
  {
    label: StatusType.Completed,
    href: '#/completed',
  },
];

export const TodoFilter: React.FC = () => {
  const { todos, filter } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const numberOfActiveTodos = todos.filter((todo) => !todo.completed).length;
  const hasCompletedTodos = todos.some((todo) => todo.completed);

  const setFilter = (newFilter: StatusType) => {
    dispatch({ type: 'SET_FILTER', payload: newFilter });
  };

  const onClearCompleted = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    const activeTodos = todos.filter((todo) => !todo.completed);
    const completedTodoIds = completedTodos.map((todo) => todo.id);

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });

    completedTodos.forEach((todo) => {
      dispatch({ type: 'SET_SELECTED', payload: todo.id });
    });

    try {
      dispatch({ type: 'SET_TODOS', payload: activeTodos });

      const deletedTodos = completedTodoIds.map((todoId) => (
        todoService.deleteTodo(
          todoId,
        )
      ));

      await Promise.all(deletedTodos);
    } catch (error) {
      dispatch(
        { type: 'SET_ERROR', payload: 'Unable to clear completed todos' },
      );
      dispatch({ type: 'SET_TODOS', payload: todos });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'CLEAR_SELECTED' });
    }
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberOfActiveTodos} items left`}
      </span>

      <nav className="filter">

        {filterOptions.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className={
              classNames('filter__link',
                { selected: filter === label })
            }
            onClick={() => setFilter(label)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: !hasCompletedTodos,
        })}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
