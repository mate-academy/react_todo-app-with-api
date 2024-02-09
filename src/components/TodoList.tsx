import { useContext } from 'react';

import { TodoContext } from './TodosContext';
import { TodoContextProps } from '../types/TodoContextProps';

import { TodoItem } from './TodoItem';
import { filterTodos } from '../utils/getFilteredTodos';

export const TodoList:React.FC = () => {
  const {
    todos,
    filter,
    tempTodo,
    errorMessage,
  }:TodoContextProps = useContext(TodoContext);

  const filteredTodos = filterTodos(todos, filter);

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
      {!!tempTodo && !errorMessage && (
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

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div
            data-cy="TodoLoader"
            className="modal overlay is-active"
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </ul>
  );
};
