import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deletingTodoIds: number[];
  onDelete: (id: number) => void;
  hasTodos: boolean;
  onToggle: (id: number) => void | Promise<void>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoIds,
  onDelete,
  onToggle,
  setTodos,
  setErrorMessage,
}) => (
  <ul className="todo-list" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isDeleting={deletingTodoIds.includes(todo.id)}
        onDelete={onDelete}
        onToggle={onToggle}
        setTodos={setTodos}
        setErrorMessage={setErrorMessage}
      />
    ))}
  </ul>
);
