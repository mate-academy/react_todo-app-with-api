import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../todoInfo/todoInfo';

interface TodoListProps {
  todos: Todo[];
  tempTodo?: Todo | null;
  deletedTodos?: number[];
  updatedTodos?: number[];
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number) => void;
  onUpdateTitle: (
    e: React.FormEvent<HTMLFormElement>,
    todoId: number,
    newTitle: string,
  ) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  deletedTodos,
  updatedTodos,
  onDelete,
  onToggle,
  onUpdateTitle,
}) => {
  const allTodos = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {allTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          data-cy="Todo"
          todo={todo}
          deletedTodos={deletedTodos}
          updatedTodos={updatedTodos}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
        />
      ))}
    </section>
  );
};
