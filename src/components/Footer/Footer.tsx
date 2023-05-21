import { FC, useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { SortTypes } from '../../types/SortTypes';
import { Nav } from '../Nav';

interface Props {
  todos: Todo[];
  activeFilter: SortTypes;
  onChangeFilter: (filter: SortTypes) => void;
  onClearCompletedTodos: () => void;
}

export const Footer: FC<Props> = ({
  todos,
  activeFilter,
  onChangeFilter,
  onClearCompletedTodos,
}) => {
  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  return (
    <>
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodos} items left`}
        </span>

        <Nav
          todos={todos}
          onChangeFilter={onChangeFilter}
          activeFilter={activeFilter}
          onClearCompletedTodos={onClearCompletedTodos}
        />
      </footer>
    </>
  );
};
