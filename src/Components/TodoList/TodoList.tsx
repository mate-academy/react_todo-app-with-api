import { TransitionGroup, CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import { useContext } from 'react';
import { TodoContext } from '../../TodoContext/TodoContext';
import { Filters } from '../../utils/enums';
import { TodoItem } from '../TodoItem';

export const TodoList = () => {
  const {
    todos,
    selectedFilter,
    tempTodo,
    isLoading,
  } = useContext(TodoContext);

  const visibleTodos = todos.filter(({ completed }) => {
    switch (selectedFilter) {
      case Filters.All:
        return true;

      case Filters.Active:
        return !completed;

      case Filters.Completed:
        return completed;

      default:
        return 0;
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
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="item"
          >
            <div
              className="todo"
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button
                type="button"
                className="todo__remove"
              >
                ×
              </button>

              <div className={cn('modal overlay', {
                'is-active': isLoading,
              })}
              >
                <div
                  className="modal-background
                has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
