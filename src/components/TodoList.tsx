import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
  toggleTodoStatus: (todoId: number) => void,
  updateTodoTitle: (id: number, newTitle: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  deleteTodoId,
  toggleTodoStatus,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDelete={deleteTodo}
            deleteTodoId={deleteTodoId}
            toggleTodoStatus={toggleTodoStatus}
            updateTodoTitle={updateTodoTitle}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={deleteTodo}
          deleteTodoId={deleteTodoId}
          toggleTodoStatus={toggleTodoStatus}
          updateTodoTitle={updateTodoTitle}
        />
      )}
    </section>
  );
};
