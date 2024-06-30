import React from 'react';
import { Todo } from '../Todo/Todo';
import { TodoType } from '../../types/Todo.type';

export interface TodoListProps {
  todoList: TodoType[];
  tempTodo: TodoType | null;
  deleteTodo: (todoId: number) => void;
  updateTodo: (updatedTodo: TodoType) => Promise<boolean>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todoList,
  tempTodo,
  deleteTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <Todo
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
          updateTodo={updateTodo}
        />
      ))}
      {tempTodo && (
        <Todo todo={tempTodo} deleteTodo={deleteTodo} updateTodo={updateTodo} />
      )}
    </section>
  );
};
