/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo, useContext, useMemo } from 'react';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TodoFormUpdate } from './TodoFormUpdate';
import { TodosContext } from '../store/TodosContext';
import { getTodosByOptions } from '../utils/todoUtils';

export const TodoList = memo(function TodoListComponent() {
  const {
    option,
    todos,
    setSelectedTodo,
    selectedTodo,
    tempTodo,
    deletedTodos,
    loading,
    deletedTodosId,
    updateTodos,
    updatedTodos,
  } = useContext(TodosContext);

  const todosByOption = useMemo(
    () => getTodosByOptions(option, todos),
    [option, todos],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todosByOption.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <div
              data-cy="Todo"
              className={cn('todo', {
                completed: todo.completed,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onClick={() =>
                    updateTodos([{ ...todo, completed: !todo.completed }])
                  }
                />
              </label>

              {todo.id === selectedTodo?.id ? (
                <TodoFormUpdate key={selectedTodo.id} />
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => setSelectedTodo(todo)}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => deletedTodos([todo.id])}
                  >
                    ×
                  </button>
                </>
              )}

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active':
                    loading &&
                    (deletedTodosId?.includes(todo.id) ||
                      updatedTodos?.some(
                        currentTodo => currentTodo.id === todo.id,
                      )),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

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
});
