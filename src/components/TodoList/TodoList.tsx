import React, {
  useContext,
  useMemo,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TypeOfFiltering } from '../../types/TypeOfFiltering';
import './TodoList.scss';
import { TodoItem } from '../TodoItem';
import { TodoContext } from '../../contexts/TodoContext';

export const TodoList: React.FC = () => {
  const {
    todos,
    tempTodo,
    filterType,
  } = useContext(TodoContext);

  const visibleTodos = useMemo<Todo[]>(() => {
    return todos.filter((todo: Todo) => {
      switch (filterType) {
        case TypeOfFiltering.Active:
          return !todo.completed;

        case TypeOfFiltering.Comleted:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filterType]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
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
              todo={tempTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>

    </section>
  );
};
