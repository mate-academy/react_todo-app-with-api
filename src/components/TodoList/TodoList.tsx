import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null;
  loadedTodoIds: number[];
  handleRemoveTodo: (id: number) => void
  onUpdateTodo: (id: number, title: string) => void;
  onChangeComplete: (id: number, completed: boolean) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadedTodoIds,
  handleRemoveTodo,
  onUpdateTodo,
  onChangeComplete,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          isLoading={loadedTodoIds.includes(todo.id)}
          onDeleteTodo={handleRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          onChangeComplete={() => (
            onChangeComplete(todo.id, !todo.completed))}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          isLoading
          onDeleteTodo={handleRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          onChangeComplete={() => null}
        />
      )}
    </section>
  );
};
