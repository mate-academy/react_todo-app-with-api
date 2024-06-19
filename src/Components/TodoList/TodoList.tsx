import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  isLoading: number[];
  tempTodo: Todo | null;
  toggleTodo: (todoToUpdate: Todo) => void;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  isLoading,
  tempTodo,
  toggleTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos &&
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            isLoading={isLoading.includes(todo.id)}
            toggleTodo={toggleTodo}
            updateTodo={updateTodo}
          />
        ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={() => {}}
          isLoading
          toggleTodo={toggleTodo}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};
