import React from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onUpdate: (t: Todo) => void;
};

export const TodoList: React.FC<Props> = ({ todos, setTodos, onUpdate }) => {
  function removeTodo(todoId: number) {
    deleteTodo(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          todos={todos}
          onUpdate={onUpdate}
          onDelete={() => removeTodo(todo.id)}
          key={todo.id}
          todo={todo}
        />
      ))}
    </section>
  );
};
