import { useMemo } from 'react';

import { FilterOptions } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  filterOption: FilterOptions;
  isInputProcessing: boolean;
  processingIds: number[];
  handleDeleteTodo: (id: number) => void;
  handleToggleStatus: (todo: Todo) => void;
  handleUpdateTodo: (todoId: number, newTitle: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  filterOption,
  processingIds,
  handleDeleteTodo,
  handleToggleStatus,
  handleUpdateTodo,
}) => {
  const visibleTodos = useMemo(() => {
    return todos.filter((todo: Todo) => {
      switch (filterOption) {
        case FilterOptions.Active:
          return !todo.completed;

        case FilterOptions.Completed:
          return todo.completed;

        case FilterOptions.All:
          return todo;
      }
    });
  }, [filterOption, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map((todo: Todo) => {
          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                isLoading={isLoading}
                handleDeleteTodo={handleDeleteTodo}
                handleToggleStatus={handleToggleStatus}
                processingIds={processingIds}
                handleUpdateTodo={handleUpdateTodo}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
