import React, { useMemo, useCallback, useContext } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './Todo';
import { Status } from '../types/Status';
import { AuthContext } from './Auth/AuthContext';

type Props = {
  todos: Todo[];
  status: Status;
  onDelete: (id: number) => void;
  isAdding: boolean;
  loadingTodosIds: number[];
  currentTitle: string;
  onRename: (todo: Todo, newTitle: string) => Promise<void>,
  onChangeStatus: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  status,
  onDelete,
  isAdding,
  loadingTodosIds,
  currentTitle,
  onRename,
  onChangeStatus,
}) => {
  const getVisibleTodos = useCallback((): Todo[] => {
    return todos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        case Status.All:
        default:
          return todos;
      }
    });
  }, [todos, status]);

  const user = useContext(AuthContext);

  const visibleTodos = useMemo(
    getVisibleTodos,
    [todos, status],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={loadingTodosIds.includes(todo.id)}
          onRename={onRename}
          onChangeStatus={onChangeStatus}
        />
      ))}

      {isAdding && user && (
        <TodoItem
          todo={{
            id: 0,
            title: currentTitle,
            completed: false,
            userId: user?.id,
          }}
          onDelete={onDelete}
          isLoading
          onRename={onRename}
          onChangeStatus={onChangeStatus}
        />
      )}
    </section>
  );
};
