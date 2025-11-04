import React, { useContext, useMemo } from 'react';
import { TodosContext } from '../contexts/TodoContext';
import { TodoItem } from '../ui/TodoItem';
import { EditProvider } from '../contexts/EditContext';
import { FILTER } from '../model/types';

export const TodoList: React.FC = () => {
  const { state, deletingTodoIds, processingIds } = useContext(TodosContext);
  const { todos, filter, tempTodo } = state;

  const visibleTodos = useMemo(() => {
    const processing = new Set(processingIds);

    const matches = (completed: boolean) => {
      if (filter === FILTER.COMPLETED) {
        return completed;
      }

      if (filter === FILTER.ACTIVE) {
        return !completed;
      }

      return true;
    };

    return todos.filter(t => matches(t.completed) || processing.has(t.id));
  }, [todos, filter, processingIds]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 && (
        <EditProvider>
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoading={
                deletingTodoIds.includes(todo.id) ||
                processingIds.includes(todo.id)
              }
            />
          ))}
        </EditProvider>
      )}

      {tempTodo && (
        <TodoItem key={`temp-${tempTodo.title}`} todo={tempTodo} isLoading />
      )}
    </section>
  );
};
