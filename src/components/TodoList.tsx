import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  deleteTodo: (id: number) => void
  tempTodo: Todo | null
  updateTodo: (updatedTodo: Todo) => void
  loadingById: number[]
  setLoadingById: React.Dispatch<React.SetStateAction<number[]>>
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo = () => { },
  tempTodo,
  updateTodo,
  loadingById,
  setLoadingById,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          loadingById={loadingById}
          setLoadingById={setLoadingById}
        />
      ))}
      {tempTodo !== null && (
        <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span className="todo__title">
            {tempTodo.title}
          </span>
        </div>
      )}
    </section>
  );
};
