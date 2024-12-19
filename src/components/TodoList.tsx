import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  handleChangeCompletion: (todo: Todo, newIsCompleted: boolean) => void;
  handleDeleteTodo: (id: number) => void;
  todos: Todo[];
  todoBeingUpdated: number | null;
  todosIdBeingEdited: number[];
  updateTodoTitle: (todo: Todo, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  handleChangeCompletion,
  handleDeleteTodo,
  todos,
  todosIdBeingEdited,
  todoBeingUpdated,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleChangeCompletion={handleChangeCompletion}
          handleDeleteTodo={handleDeleteTodo}
          isBeingEdited={todosIdBeingEdited.includes(todo.id)}
          todoBeingUpdated={todoBeingUpdated}
          updateTodoTitle={updateTodoTitle}
        />
      ))}
    </section>
  );
};
