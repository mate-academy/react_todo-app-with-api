import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[]
}

export const TodoMain: React.FC<Props> = (props) => {
  const { todos } = props;

  const toggler = (todoId: number) => {
    const changedTodo = todos.find(todo => todoId === todo.id);
    const newTodo = { ...changedTodo };

    if (changedTodo) {
      newTodo.completed = !changedTodo.completed;
    }

    todos.map(todo => {
      if (todo.id === newTodo.id) {
        return newTodo;
      }

      return todo;
    });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={classNames('todo', 'completed' && todo.completed)}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                toggler(todo.id);
              }}
              // defaultChecked
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          or

          {/* <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue="JS"
            />
          </form> */}

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
