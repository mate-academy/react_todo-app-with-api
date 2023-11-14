import { useContext } from 'react';

import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../TodoContext/TodoContext';

export const TodoList = () => {
  const {
    getFilteredTodos,
    tempTodo,
    processingIds,
  } = useContext(TodosContext);

  return (
    <section className="todoapp__main">
      {getFilteredTodos().map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={processingIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isProcessed
        />
      )}
    </section>
  );
};
