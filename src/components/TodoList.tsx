/* eslint-disable prettier/prettier */
import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  loading: boolean;
  handleDelete: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
  handleToggle: (todoId: number, completed: boolean) => Promise<void>;
  handleUpdateTitle: (
    todoId: number,
    newTitle: string,
    onSuccess?: () => void,
  ) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loading,
  handleDelete,
  handleToggle,
  handleUpdateTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {loading
        ? null
        : todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDelete={handleDelete}
            tempTodo={tempTodo}
            handleToggle={handleToggle}
            handleUpdateTitle={handleUpdateTitle}
          />
        ))}
    </section>
  );
};

export default TodoList;
