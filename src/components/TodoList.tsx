import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  todoItem: Todo | null,
  currentTodoLoading: number[],
  deleteTodo:(todo: Todo) => void;
  handleToggleComplete: (todo: Todo) => void;
  handleTextUpdate: (id: number) => void;
};

export const TodoList:React.FC<Props> = ({
  todos,
  todoItem,
  deleteTodo,
  currentTodoLoading,
  handleTextUpdate,
  handleToggleComplete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          handleEdit={handleToggleComplete}
          todo={todo}
          deleteTodo={deleteTodo}
          isLoading={currentTodoLoading.includes(todo.id)}
          onTodoClick={handleTextUpdate}
        />

      ))}
      {todoItem && (
        <TodoItem
          handleEdit={handleToggleComplete}
          todo={todoItem}
          deleteTodo={deleteTodo}
          isLoading
          onTodoClick={handleTextUpdate}
        />
      )}
    </section>
  );
};
