import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  onDeleteTodo: (todoId: number) => void,
  onUpdateTodo: (todoId: number, args: Partial<Todo>) => void,
  loadingIdsList: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onUpdateTodo,
  loadingIdsList,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          loading={loadingIdsList.includes(todo.id)}
          onDeleteTodo={onDeleteTodo}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TempTodo
          tempTodo={tempTodo}
        />
      )}
    </section>
  );
};
