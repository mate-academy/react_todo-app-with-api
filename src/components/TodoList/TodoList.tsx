import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  onDeleteTodo: (value: number) => void,
  todosIdInProcess: number[],
  onToggleComplete: (todo: Todo) => void,
  onHandleEditTodo: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  todosIdInProcess,
  onToggleComplete,
  onHandleEditTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              todosIdInProcess={todosIdInProcess}
              onToggleComplete={onToggleComplete}
              onHandleEditTodo={onHandleEditTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div
              key={tempTodo.id}
              className={classnames('todo',
                {
                  completed: tempTodo.completed,
                })}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked
                />
              </label>

              <span className="todo__title">{tempTodo.title}</span>

              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
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
