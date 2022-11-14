import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoData } from '../TodoData';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  tempTodo: Todo;
  changingTodosId: number[];
  handleToggleTodo: (todoId: number, completed: boolean) => void;
  isAdding: boolean;
  handleEditTodo: (todoId:number, title: string) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  handleDeleteTodo,
  isAdding,
  tempTodo,
  changingTodosId,
  handleToggleTodo,
  handleEditTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoData
            todo={todo}
            key={todo.id}
            handleDeleteTodo={handleDeleteTodo}
            changingTodosId={changingTodosId}
            handleToggleTodo={handleToggleTodo}
            handleEditTodo={handleEditTodo}
          />
        );
      })}
      {isAdding && (
        <TodoData
          todo={tempTodo}
          key={tempTodo.id}
          handleDeleteTodo={handleDeleteTodo}
          changingTodosId={changingTodosId}
          handleToggleTodo={handleToggleTodo}
          handleEditTodo={handleEditTodo}
        />
      )}
    </section>
  )
});
