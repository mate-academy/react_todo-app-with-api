/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Data, Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todoList: Todo[];
  loading: boolean;
  todoLoading: boolean;
  tempTodo: Todo | null;
  clearTodoComplete: boolean;
  selected: number;
  deleteTodos: (todoId: number) => Promise<unknown>;
  setSelected: (todoId: number) => void;
  completed: (todoId: number) => Promise<void> | undefined;
  handleInputChange: (event: React.FormEvent, data: Data) => void;
};

export const TodoList: React.FC<Props> = ({
  todoLoading,
  todoList,
  loading,
  tempTodo,
  selected,
  clearTodoComplete,
  setSelected,
  handleInputChange,
  deleteTodos,
  completed,
}) => {
  const [changesTodo, setChangesTodo] = useState<number | undefined>(undefined);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          selected={selected}
          todoLoading={todoLoading}
          changesTodo={changesTodo}
          clearTodoComplete={clearTodoComplete}
          deleteTodos={() => deleteTodos(todo.id)}
          cheketCompleted={() => completed(todo.id)}
          setChangesTodo={() => setChangesTodo(todo.id)}
          setSelected={setSelected}
          handleInputChange={handleInputChange}
        />
      ))}

      {loading && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo?.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
