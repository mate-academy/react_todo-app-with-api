/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface TodoListProps {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  todoTemp: Todo | null;
  updateStatusTodo: (todo: Todo) => void;
  todoIds: number[];
  onChangeTitle: (todo: Todo, newTitle: string) => Promise<boolean>;
  errorMessage: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  deleteTodo,
  todoTemp,
  updateStatusTodo,
  todoIds,
  onChangeTitle,
  errorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              key={todo.id}
              deleteTodo={deleteTodo}
              todoIds={todoIds}
              updateStatusTodo={updateStatusTodo}
              onChangeTitle={onChangeTitle}
              errorMessage={errorMessage}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

      {todoTemp && (
        <div data-cy="Todo" className={`todo`}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {todoTemp.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className={`modal overlay is-active`}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
