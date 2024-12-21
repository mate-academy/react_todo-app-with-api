import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../enums/TodoFilters.enum';
import { Header } from './Header';
import { Footer } from './Footer';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  shouldFocus: boolean;
  targetTodoId: number | null;
  togglingTodoIds: number[];
  onEmptyTitleError: () => void;
  onAddTodo: (title: string) => void;
  onClearCompleted: () => void;
  onToggleOneCompleted?: (todo: Todo) => void;
  onToggleAllCompleted: () => void;
  onDelete: (id: number) => Promise<boolean>;
  onRenameTodo?: (todo: Todo, title: string) => Promise<boolean>;
};

export const Todos: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  shouldFocus,
  targetTodoId,
  togglingTodoIds,
  onDelete,
  onAddTodo,
  onClearCompleted,
  onEmptyTitleError,
  onToggleOneCompleted,
  onToggleAllCompleted,
  onRenameTodo,
}) => {
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);

  const hasAllTodosCompleted = todos.every(todo => todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp__content">
      <Header
        todos={todos}
        isLoading={isLoading}
        shouldFocus={shouldFocus}
        hasAllTodosCompleted={hasAllTodosCompleted}
        onAddTodo={onAddTodo}
        onEmptyTitleError={onEmptyTitleError}
        onToggleAllCompleted={onToggleAllCompleted}
      />

      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isDeleting={targetTodoId === todo.id}
            onDelete={onDelete}
            onToggleOneCompleted={onToggleOneCompleted}
            onRenameTodo={onRenameTodo}
            isLoading={
              togglingTodoIds.includes(todo.id) || targetTodoId === todo.id
            }
          />
        ))}
        {tempTodo && <TodoItem todo={tempTodo} isLoading={isLoading} />}
      </section>

      {todos.length > 0 && (
        <Footer
          filter={filter}
          hasCompletedTodos={hasCompletedTodos}
          notCompletedTodosCount={notCompletedTodos}
          setFilter={setFilter}
          onClearCompleted={onClearCompleted}
        />
      )}
    </div>
  );
};
