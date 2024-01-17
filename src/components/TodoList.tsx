import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[],
  deleteTodo: (todo: number) => void,
  todoCompleteUpdate: (todoId: number, newCompleted: boolean) => void,
  activeFilter: Status,
  onTodoEdit: (todoId: number, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  todoCompleteUpdate,
  activeFilter,
  onTodoEdit,
}) => {
  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === 'active') {
      return !todo.completed;
    }

    if (activeFilter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          onTodoEdit={onTodoEdit}
          todoCompleteUpdate={todoCompleteUpdate}
        />
      ))}
    </>
  );
};
