/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { memo } from 'react';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TodoFormUpdate } from '../TodoFormUpdate';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onSelectTodo: (todo: Todo | null) => void;
  selectedTodo: Todo | null;
  tempTodo: Todo | null;
  onDelete: (id: number[]) => void;
  loading: boolean;
  deletedTodosId: number[] | null;
  onUpdate(todos: Todo[]): Promise<PromiseSettledResult<void>[]>;
  updatedTodos: Todo[] | null;
  titleField: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = memo(function TodoListComponent({
  todos,
  onSelectTodo,
  selectedTodo,
  tempTodo,
  onDelete,
  loading,
  deletedTodosId,
  onUpdate,
  updatedTodos,
  titleField,
}) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
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
                    onUpdate([{ ...todo, completed: !todo.completed }])
                  }
                />
              </label>

              {todo.id === selectedTodo?.id ? (
                <TodoFormUpdate
                  key={selectedTodo.id}
                  todoUpdate={selectedTodo}
                  onUpdate={onUpdate}
                  onSelectTodo={onSelectTodo}
                  onDelete={onDelete}
                  titleField={titleField}
                />
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => onSelectTodo(todo)}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => onDelete([todo.id])}
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
