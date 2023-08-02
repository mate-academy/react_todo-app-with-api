import React from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  deleteTodoHandler: (todoId: number) => void;
  processing: boolean;
  toggleCompletedTodo: (todoId: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRename: (todo: Todo, title: string) => Promise<any>;
};

export const Todolist: React.FC<Props> = (
  {
    todos, deleteTodoHandler, processing, toggleCompletedTodo, onRename,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          onRename={onRename}
          processing={processing}
          deleteTodoHandler={deleteTodoHandler}
          todo={todo}
          key={todo.id}
          toggleCompletedTodo={toggleCompletedTodo}
        />
      ))}
    </section>
  );
};
