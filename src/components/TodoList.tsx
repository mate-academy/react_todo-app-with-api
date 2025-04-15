import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => Promise<boolean>;
  updateTodo: (id: number) => void;
  editTodoTitle: (id: number, newTitle: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  updateTodo,
  editTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onClick={() => removeTodo(todo.id)}
          onCheckboxClick={() => updateTodo(todo.id)}
          onUpdate={async newTitle => editTodoTitle(todo.id, newTitle)}
          onDelete={() => removeTodo(todo.id)}
        />
      ))}
    </section>
  );
};
