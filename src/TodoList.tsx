import React from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  deleteTodoHandler: (todoId: number) => void;
  toggleCompletedTodo: (todoId: number) => void;
  onRename: (todo: Todo, title: string) => Promise<void>;
  processingIds: number[],
  tempTodo: Todo | null,
};

export const Todolist: React.FC<Props> = (
  {
    todos,
    deleteTodoHandler,
    toggleCompletedTodo,
    onRename,
    processingIds,
    tempTodo,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          onRename={onRename}
          processing={processingIds.includes(todo.id)}
          deleteTodoHandler={deleteTodoHandler}
          todo={todo}
          key={todo.id}
          toggleCompletedTodo={toggleCompletedTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          processing
          onRename={onRename}
          toggleCompletedTodo={() => {}}
          deleteTodoHandler={() => {}}
        />
      )}

    </section>
  );
};
