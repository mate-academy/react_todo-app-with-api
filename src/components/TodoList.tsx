import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  hideError: () => void;
  proccessedTodoIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  hideError,
  proccessedTodoIds,
  tempTodo,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  let fullTodos = [...todos];

  if (tempTodo !== null) {
    fullTodos = [...fullTodos, tempTodo];
  }

  return (
    <>
      {fullTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          hideError={hideError}
          processedTodoIds={proccessedTodoIds}
        />
      ))}
    </>
  );
};
