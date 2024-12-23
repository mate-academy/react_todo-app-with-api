import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo?: Todo | null;
  onRemoveTodo: (todoId: number) => void;
  onToggleTodoCompletion: (todo: Todo) => void;
  onUpdateTodoTitle: (todo: Todo) => Promise<string>;
  isLoading: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onRemoveTodo,
  onToggleTodoCompletion,
  onUpdateTodoTitle,
  isLoading,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onRemoveTodo={onRemoveTodo}
        onToggleTodoCompletion={onToggleTodoCompletion}
        onUpdateTodoTitle={onUpdateTodoTitle}
        isLoading={isLoading.includes(todo.id)}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        onRemoveTodo={() => {}}
        onToggleTodoCompletion={() => {}}
        onUpdateTodoTitle={async (todo: Todo) => todo.title}
        isLoading={isLoading.includes(0)}
      />
    )}
  </section>
);
