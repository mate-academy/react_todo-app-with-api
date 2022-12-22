import {
  FC, memo, Fragment, useMemo,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoErrors } from '../../types/ErrorMessages';
import { TodoItem } from '../TodoItem/TodoItem';
import { FilterOptions } from '../../types/FilterOptions';

interface Props {
  todosFromServer: Todo[],
  filterBy: FilterOptions,
  loadTodos: (id: number) => Promise<void>,
  setErrorMessage: React.Dispatch<React.SetStateAction<TodoErrors>>,
}

export const TodoList: FC<Props> = memo(({
  todosFromServer,
  loadTodos,
  setErrorMessage,
  filterBy,
}) => {
  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case FilterOptions.Active:
        return todosFromServer.filter(todo => !todo.completed);
      case FilterOptions.Completed:
        return todosFromServer.filter(todo => todo.completed);
      case FilterOptions.All:
      default:
        return todosFromServer;
    }
  }, [todosFromServer, filterBy]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return (
          <Fragment key={todo.id}>
            <TodoItem
              todo={todo}
              loadTodos={loadTodos}
              setErrorMessage={setErrorMessage}
            />
          </Fragment>
        );
      })}
    </section>
  );
});
