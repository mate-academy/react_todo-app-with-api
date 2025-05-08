import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todosIsLoading: number[];
  // isEditing: boolean;
  removeTodo: (todoId: number[]) => void;
  updateStatusTodo: (todo: Todo[]) => void;
  // setIsEditing: (isEditing: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todosIsLoading,
  // isEditing,
  removeTodo,
  updateStatusTodo,
  // setIsEditing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updateStatusTodo={updateStatusTodo}
          isLoading={todosIsLoading.includes(todo.id)}
          // setIsEditing={setIsEditing}
          // isEditing={isEditing}
        />
      ))}
    </section>
  );
};
