import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  loadingTodoId: number | null;
  setErrorText: (text: string) => void;
  handleUpdateTodo: (id: number, newTitle: string, completed: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  loadingTodoId,
  setErrorText,
  handleUpdateTodo,
}) => {
  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          handleUpdateTodo={handleUpdateTodo}
          todo={todo}
          key={todo.id}
          onDelete={handleDelete}
          isLoading={loadingTodoId === todo.id}
          setErrorText={setErrorText}
        />
      ))}
    </section>
  );
};
