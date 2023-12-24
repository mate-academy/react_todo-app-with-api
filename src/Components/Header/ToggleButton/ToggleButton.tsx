import { useState } from 'react';
import cn from 'classnames';
import { useTodoContext } from '../../../Context/Context';

export const ToggleButton = () => {
  const [isActive, setIsActive] = useState(false);
  const { renderedTodos, toggleTodoCompleted } = useTodoContext();
  const areAllCompleted = renderedTodos.every(({ completed }) => completed);
  const toggleTodods = () => {
    const completedTodos = renderedTodos.filter(({ completed }) => completed);
    const activeTodos = renderedTodos.filter(({ completed }) => !completed);

    if (isActive) {
      completedTodos.forEach(todo => toggleTodoCompleted(todo));
    }

    activeTodos.forEach(todo => toggleTodoCompleted(todo));
  };

  return (
    <button
      aria-label="toggle-button"
      type="button"
      className={cn('todoapp__toggle-all', { active: areAllCompleted })}
      data-cy="ToggleAllButton"
      onClick={() => {
        setIsActive(!isActive);
        toggleTodods();
      }}
    />
  );
};
