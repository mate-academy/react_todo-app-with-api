import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todoId: number) => void,
  isEditing: boolean,
  setIsEditing: (value: boolean) => void,
  updateTodoOnServer: (todoId: number, data: Partial<Todo>) => void,
  currTodo: number,
  setCurrTodo: (value: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  isEditing,
  setIsEditing,
  updateTodoOnServer,
  currTodo,
  setCurrTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          currTodo={currTodo}
          setCurrTodo={setCurrTodo}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleDeleteTodo={handleDeleteTodo}
          updateTodoOnServer={updateTodoOnServer}
        />
      ))}
    </section>
  );
};
