import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { TodoContext, TodoUpdateContext } from '../../TodoContext';

type Props = {
  isActive: boolean,
};

export const AllCheckButton: React.FC<Props> = React.memo(({ isActive }) => {
  const { todos } = useContext(TodoContext);
  const { modifyTodos, setActiveIds } = useContext(TodoUpdateContext);

  // handle status change button
  const changeAllComplet = useCallback(() => {
    const isNotCompleted = todos.every(({ completed }) => !completed);

    if (isActive || isNotCompleted) {
      const allIds = todos.map(todo => todo.id);
      const modifiedTodos = todos.map(todo => {
        return ({
          ...todo,
          completed: !todo.completed,
        });
      });

      setActiveIds(allIds);
      modifyTodos(modifiedTodos);
    } else {
      const nonActiveTodos = todos
        .filter(({ completed }) => !completed);
      const nonActiveIds = nonActiveTodos
        .map(todo => todo.id);
      const modifiedTodos = nonActiveTodos
        .map(todo => {
          return ({
            ...todo,
            completed: !todo.completed,
          });
        });

      setActiveIds(nonActiveIds);
      modifyTodos(modifiedTodos);
    }
  }, [todos]);

  return (
    <button
      aria-label="all-check"
      data-cy="ToggleAllButton"
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        { active: isActive },
      )}
      onClick={changeAllComplet}
    />
  );
});
