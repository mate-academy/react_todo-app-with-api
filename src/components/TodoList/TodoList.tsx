import cn from 'classnames';
import React, { useContext } from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../TodosProvider';

type Props = {
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(TodosContext);

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={cn('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <TodoItem
            todo={todo}
          />
        </div>
      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
