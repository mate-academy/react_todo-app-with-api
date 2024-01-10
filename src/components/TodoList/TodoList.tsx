import React from 'react';
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Prop = {
  todos: Todo[],
  deleteTodo: (todoID: number) => void,
  toggleTodo: (todoID: number, completed: boolean) => void,
  updateTodo: (todo: Todo) => void,
};

export const TodoList:React.FC<Prop> = React.memo(
  ({
    todos,
    deleteTodo,
    toggleTodo,
    updateTodo,
  }) => {
    return (
      <TransitionGroup>
        <ul>
          {todos.map(todo => {
            return (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <li
                  key={todo.id}
                  className={classNames('todo', { completed: todo.completed })}
                >
                  <label
                    id={todo.id.toString(10)}
                    className="todo__status-label"
                  >
                    <input
                      type="checkbox"
                      id={todo.id.toString(10)}
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)}
                    />
                  </label>
                  <TodoItem
                    todo={todo}
                    deleteTodo={deleteTodo}
                    updateTodo={updateTodo}
                  />
                </li>
              </CSSTransition>
            );
          })}
        </ul>
      </TransitionGroup>
    );
  },
);
