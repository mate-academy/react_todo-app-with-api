import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null;
  hasLoadedTodos: number[];
  handleRemoveTodo: (id: number) => void
  onUpdateTodo: (id: number, title: string) => void;
  onChangeComplete: (id: number, completed: boolean) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  hasLoadedTodos,
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
          loadedId={hasLoadedTodos.includes(todo.id)}
          onDeleteTodo={handleRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          onChangeComplete={() => (
            onChangeComplete(todo.id, !todo.completed))}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadedId
          onDeleteTodo={handleRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          onChangeComplete={() => null}
        />
      )}
    </section>
  );
};
