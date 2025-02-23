import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { DispatchContext, TodosContext } from '../Store';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { getTodos } from '../../../api/todos';

export const TodoList: React.FC = () => {
  const { todos, filterBy, tempTodo } = useContext(TodosContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    getTodos()
      .then(response => {
        dispatch({ type: 'setTodos', payload: response });
      })
      .catch(() => {
        dispatch({ type: 'setError', payload: 'Unable to load todos' });
        const timeout = setTimeout(() => {
          dispatch({ type: 'setError', payload: null });
          clearTimeout(timeout);
        }, 3000);
      });
  }, [dispatch]);

  const filterTodos = (allTodos: Todo[]): Todo[] => {
    switch (filterBy) {
      case Status.COMPLETED:
        return allTodos.filter(todo => todo.completed);

      case Status.ACTIVE:
        return allTodos.filter(todo => !todo.completed);

      default:
        return allTodos;
    }
  };

  const filteredTodos = filterTodos(todos);

  return (
    <section
      className={cn('todo-list todoapp__main', {
        'is-hidden': !todos.length,
      })}
      data-cy="TodoList"
    >
      <TransitionGroup component={null}>
        {filteredTodos.map((todo: Todo) => (
          <CSSTransition key={todo.id} timeout={500} classNames="item">
            <TodoItem key={todo.id} todo={todo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={500} classNames="item">
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo?.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
