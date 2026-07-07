import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo | null;
  isError: string | null;
  visibleTodos: Todo[];
  processingIds: number[];
  onToggleSingle: (todo: Todo) => void;
  onEditingTodoIdChange: (id: number | null) => void;
  onEditingTitleChange: (title: string) => void;
  editingTodoId: number | null;
  editingTitle: string;
  onDeleteTodo: (todoId: number) => void;
  onSubmit: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  tempTodo,
  isError,
  visibleTodos,
  processingIds,
  onToggleSingle,
  onEditingTodoIdChange,
  onEditingTitleChange,
  editingTodoId,
  editingTitle,
  onDeleteTodo,
  onSubmit,
}) => {
  return (
    <section
      className={cn('todoapp__main', { 'has-error': !!isError })}
      data-cy="TodoList"
    >
      <TransitionGroup>
        {visibleTodos.map(todo => {
          const isProcessing = processingIds.includes(todo.id);

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                isProcessing={isProcessing}
                todo={todo}
                onToggleSingle={onToggleSingle}
                onEditingTodoIdChange={onEditingTodoIdChange}
                onEditingTitleChange={onEditingTitleChange}
                editingTodoId={editingTodoId}
                editingTitle={editingTitle}
                onDeleteTodo={onDeleteTodo}
                onSubmit={onSubmit}
              />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div
              data-cy="Todo"
              className={cn('todo', { completed: tempTodo.completed })}
            >
              <label
                className="todo__status-label"
                htmlFor={`todo__status-temp`}
              >
                <span className="is-sr-only">Toggle todo status</span>
                <input
                  id={`todo__status-temp`}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  readOnly
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
};
