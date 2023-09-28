import React, { useContext } from 'react';
import { TodoContext } from '../context/todoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const {
    todos,
    loading,
    tempTodo,
    selectedTodoIds,
    onDeleteTodo,
    onUpdateTodo,
  } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          disabled={loading}
          processing={selectedTodoIds.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
          selectedTodoIds={selectedTodoIds}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          processing
          disabled={loading}
          onUpdateTodo={onUpdateTodo}
          selectedTodoIds={selectedTodoIds}
        />
      )}
    </section>
  );
};
