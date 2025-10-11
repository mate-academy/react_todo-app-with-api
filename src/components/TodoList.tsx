import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  handleDeleteTodo: (id: number) => void;
  handleUpdateTodoText: (id: number, title: string) => void;
  handleUpdateTodoStatus: (
    todoId: number,
    title: string,
    newStatus: boolean,
  ) => void;
  activeTodoId: number | null;
  setOriginalTitle: (title: string) => void;
  originalTitle: string;
  activeTodoIds: number[];
  submitTodoUpdate: (todoId: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = props => (
  <section className="todoapp__main" data-cy="TodoList">
    <div>
      {props.todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} {...props} />
      ))}
    </div>
  </section>
);
