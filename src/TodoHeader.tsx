import React from 'react';
import cn from 'classnames';
import { TodoForm } from './TodoForm';
import { Todo } from './types/Todo';

interface Props {
  tempTodo: Todo | null;
  addTodo: (title: string) => void;
  setErrorText: (error: string) => void;
  isVisibleToggleAllActive: boolean;
  isActiveToggleAllActive: boolean;
  handleToggleCompletedToActive: () => void;
}

export const TodoHeader: React.FC<Props> = ({
  tempTodo,
  addTodo,
  setErrorText,
  isVisibleToggleAllActive,
  isActiveToggleAllActive,
  handleToggleCompletedToActive,
}) => {
  return (
    <>
      <header className="todoapp__header">
        {isVisibleToggleAllActive && (
          <button
            aria-label="toggle-all active"
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isActiveToggleAllActive,
            })}
            onClick={handleToggleCompletedToActive}
          />
        )}
        <TodoForm
          tempTodo={tempTodo}
          addTodo={addTodo}
          setErrorText={setErrorText}
        />
      </header>
    </>
  );
};
