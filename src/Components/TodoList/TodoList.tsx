import { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTodoContext } from '../../TodoContext/TodoContext';
import { Status } from '../../types/TodoFilter';
import { TodoItem } from '../Todo/TodoItem';
import './TodoList.scss';

export const TodoList: FC = () => {
  const {
    filterBy,
    todos,
    tempTodo,
  } = useTodoContext();

  const visibleTodos = todos.filter((todo) => {
    switch (filterBy) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem key={todo.id} todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem todo={tempTodo} isLoadingNewTodo />
          </CSSTransition>
        )}
      </TransitionGroup>

    </section>
  );
};
