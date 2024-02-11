import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onUpdate: (t: Todo) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos, setTodos, onUpdate, tempTodo,
}) => {
  function removeTodo(todoId: number) {
    deleteTodo(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todos={todos}
              onUpdate={onUpdate}
              onDelete={() => removeTodo(todo.id)}
              key={todo.id}
              todo={todo}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

      {tempTodo === null ? '' : (
        <li data-cy="Todo" className="todo">
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
        </li>
      ) }
    </section>
  );
};
