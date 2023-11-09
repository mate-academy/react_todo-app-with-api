import { FC, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { Filters } from '../../types/Filters';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo) => void;
  isLoading: number[],
  tempTodo: Todo | null,
  filterBy: Filters,
  toggledTodos: Todo[],
};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  updateTodo,
  isLoading,
  tempTodo,
  filterBy,
  toggledTodos,
}) => {
  const visibleTodos: Todo[] = useMemo(() => {
    let filteredItems: Todo[] = todos;

    switch (filterBy) {
      case Filters.Active:
        filteredItems = filteredItems.filter(todo => !todo.completed);
        break;

      case Filters.Completed:
        filteredItems = filteredItems.filter(todo => todo.completed);
        break;

      case Filters.Toggled:
        filteredItems = toggledTodos;
        break;

      default:
        break;
    }

    return filteredItems;
  }, [todos, filterBy, toggledTodos]);

  console.log(visibleTodos);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              isLoading={isLoading.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              isLoading={isLoading.includes(tempTodo.id)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
