import React, { useCallback, useMemo } from 'react';
import { remove } from '../api/todos';
import { FilterTypes } from '../types/Filter';
import { Todo } from '../types/Todo';
import { getCompletedTodos } from '../utils/functions';
import { Filter } from './Filter';
import { ErrorMessage } from '../types/Errors';

interface Props {
  todos: Todo[],
  tabs: FilterTypes[],
  selectedTabId: string,
  setError: (value: string) => void,
  setTodos: (value: Todo[]) => void,
  setToggleAll: (value: boolean) => void;
  onTabSelected: (value: FilterTypes) => void,
}

export const Footer: React.FC<Props> = ({
  todos,
  tabs,
  selectedTabId,
  setTodos,
  setError,
  setToggleAll,
  onTabSelected,
}) => {
  const notCompleted = useMemo(() => {
    return todos.filter(({ completed }) => !completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return getCompletedTodos(todos);
  }, [todos]);

  if (completedTodos.length === todos.length) {
    setToggleAll(true);
  } else {
    setToggleAll(false);
  }

  const handlerClick = useCallback(async (completedTodo: Todo[]) => {
    try {
      completedTodo.forEach(async (todo) => {
        await remove(todo.id);
      });

      setTodos([...notCompleted]);
    } catch (errorFromServer) {
      setError(ErrorMessage.DeleteError);
    }
  }, [completedTodos.length]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${notCompleted.length} items left`}
      </span>

      <Filter
        tabs={tabs}
        selectedTabId={selectedTabId}
        onTabSelected={onTabSelected}
      />
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handlerClick(completedTodos)}
      >
        {completedTodos.length > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
