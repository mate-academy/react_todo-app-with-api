import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoData } from '../TodoData';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  isAdding: boolean;
  tempTodo: Todo;
  changingTodosId: number[];
  handleToggleTodo: (todoId: number, completed: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  isAdding,
  tempTodo,
  changingTodosId,
  handleToggleTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => {
      return (
        <TodoData
          todo={todo}
          key={todo.id}
          handleDeleteTodo={() => handleDeleteTodo(todo.id)}
          changingTodosId={changingTodosId}
          handleToggleTodo={handleToggleTodo}
        />
      );
    })}
    {isAdding && (
      <TodoData
        todo={tempTodo}
        handleDeleteTodo={() => handleDeleteTodo(tempTodo.id)}
        changingTodosId={changingTodosId}
        handleToggleTodo={handleToggleTodo}
      />
    )}
  </section>
);
