import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  filteredTodos: Todo[];
  setError: (value: string | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setDeletUpdatTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  tempTodo: Todo | null;
  deletUpdatTodoIds: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  setError,
  setDeletUpdatTodoIds,
  setTodos,
  tempTodo,
  deletUpdatTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        setError={setError}
        setDeletUpdatTodoIds={setDeletUpdatTodoIds}
        setTodos={setTodos}
        isDeletUpdating={deletUpdatTodoIds.includes(todo.id)}
      />
    ))}
    {tempTodo && (
      <div data-cy="TempTodo">
        <TodoItem
          todo={tempTodo}
          setError={setError}
          setTodos={setTodos}
          setDeletUpdatTodoIds={setDeletUpdatTodoIds}
          isTemporary={true}
        />
      </div>
    )}
  </section>
);
