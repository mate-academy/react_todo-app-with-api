/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  editingTodoId: number | null;
  editedTitle: string;
  processingTodoIds: number[];

  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  onStartEditing: (todo: Todo) => void;
  onTitleChange: (title: string) => void;
  onSaveEditing: (todo: Todo) => void;
  onCancelEditing: (todo: Todo) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  editingTodoId,
  editedTitle,
  processingTodoIds,
  onToggle,
  onDelete,
  onStartEditing,
  onTitleChange,
  onSaveEditing,
  onCancelEditing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isEditing={todo.id === editingTodoId}
              editedTitle={editedTitle}
              isProcessing={processingTodoIds.includes(todo.id)}
              onToggle={() => onToggle(todo)}
              onDelete={() => onDelete(todo.id)}
              onStartEditing={() => onStartEditing(todo)}
              onTitleChange={onTitleChange}
              onSaveEditing={() => onSaveEditing(todo)}
              onCancelEditing={() => onCancelEditing(todo)}
            />
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
};
