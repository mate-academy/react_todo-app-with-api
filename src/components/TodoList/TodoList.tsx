import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  performancedTodo: Todo[],
  tempTodo: Todo | null,
  removeTodo: (todoToDelete: Todo) => Promise<void>,
  onToggle: (todo: Todo) => void,
  onRename: (todo: Todo, newTitle: string) => void,

};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  removeTodo,
  performancedTodo,
  onToggle,
  onRename,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        removeTodo={removeTodo}
        isLoading={performancedTodo.includes(todo)}
        onToggle={onToggle}
        onRename={onRename}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        removeTodo={removeTodo}
        isLoading
        onToggle={() => {}}
        onRename={onRename}
      />
    )}
  </section>
));
