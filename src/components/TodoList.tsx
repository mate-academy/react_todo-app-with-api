import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  editingId: number | null;
  tempTitle: string;
  deleteTodoId: number | null;
  changeStatusTodoId: number | null;
  tempTodo: Todo | null;

  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onDoubleClick: (todo: Todo) => void;
  onChangeTitle: (value: string) => void;
  onSubmit: (id: number) => void;
  onKeyDown: (e: React.KeyboardEvent, id: number) => void;
  onKeyUp: (e: React.KeyboardEvent) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  editingId,
  tempTitle,
  deleteTodoId,
  changeStatusTodoId,
  tempTodo,
  ...handlers
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isEditing={editingId === todo.id}
        tempTitle={tempTitle}
        deleteTodoId={deleteTodoId}
        changeStatusTodoId={changeStatusTodoId}
        {...handlers}
      />
    ))}

    {tempTodo && (
      <div data-cy="Todo" className="todo">
        <span data-cy="TodoTitle">{tempTodo.title}</span>
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
