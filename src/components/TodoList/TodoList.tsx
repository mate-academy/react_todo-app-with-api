import { FC, useEffect, useState } from 'react';
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
  changeErrorMessage: (value: string) => void,
};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  updateTodo,
  isLoading,
  tempTodo,
  filterBy,
  changeErrorMessage,
}) => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);

  useEffect(() => {
    let filteredItems = todos;

    switch (filterBy) {
      case Filters.Active:
        filteredItems = filteredItems.filter(todo => !todo.completed);
        break;

      case Filters.Completed:
        filteredItems = filteredItems.filter(todo => todo.completed);
        break;

      case Filters.Toggled:
        filteredItems = todos;
        break;
      default:
        break;
    }

    setVisibleTodos(filteredItems);
  }, [todos, filterBy]);

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
              changeErrorMessage={changeErrorMessage}
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
              changeErrorMessage={changeErrorMessage}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
