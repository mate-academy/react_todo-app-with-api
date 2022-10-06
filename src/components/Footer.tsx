import React, { useMemo } from 'react';
import { remove } from '../api/todos';
import { FilterTypes } from '../types/Filter';
import { Todo } from '../types/Todo';
import { getCompletedTodos } from '../utils/functions';
import { Filter } from './Filter';

interface Props {
  todos: Todo[],
  tabs: FilterTypes[],
  selectedTabId: string,
  onTabSelected: (value: FilterTypes) => void,
  setError: (value: string) => void,
  setTodos: (value: Todo[]) => void,
  setToggleAll: (value: boolean) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  tabs,
  selectedTabId,
  onTabSelected,
  setTodos,
  setError,
  setToggleAll,
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

  const handlerClick = (completedTodo: Todo[]) => {
    const fetchData = async () => {
      try {
        completedTodo.forEach(async (todo) => {
          await remove(todo.id);
        });

        setTodos([...notCompleted]);
      } catch (errorFromServer) {
        setError('Unable to delete a todo');
      }
    };

    fetchData();
  };

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
