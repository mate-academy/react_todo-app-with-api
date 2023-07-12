import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface ListProps {
  todos: Todo[],
  loadedTodoId: number[],
  temporaryTodo: Todo | null,
  toggleCompleted: (todoId:number, completed: boolean) => void;
  changeTitle: (todoId:number, todoTitle: string) => void;
  removeTodo: (todoId: number) => void,
}

export const TodoList: React.FC<ListProps> = ({
  todos,
  loadedTodoId,
  temporaryTodo,
  toggleCompleted,
  changeTitle,
  removeTodo,

}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const isLoading = loadedTodoId.some(todoId => todoId === todo.id);

        return (
          <TodoItem
            todo={todo}
            isLoading={isLoading}
            toggleCompleted={toggleCompleted}
            changeTitle={changeTitle}
            removeTodo={removeTodo}
            key={todo.id}
          />
        );
      })}

      {temporaryTodo && (
        <TodoItem
          todo={temporaryTodo}
          isLoading
          toggleCompleted={toggleCompleted}
          changeTitle={changeTitle}
          removeTodo={removeTodo}
        />
      )}
    </section>
  );
};
