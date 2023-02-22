import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  isClearCompleted: boolean,
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  deletingTodoId: number,
  editTodoStatus: (todo: Todo) => void,
  isToggle: boolean,
  editTodoTitle: (todo: Todo, newTitle: string) => void,
  editingId: number,
  handleEditingId: (id: number) => void,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  isClearCompleted,
  tempTodo,
  deleteTodo,
  deletingTodoId,
  editTodoStatus,
  isToggle,
  editTodoTitle,
  handleEditingId,
  editingId,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        isClearCompleted={isClearCompleted}
        deleteTodo={deleteTodo}
        deletingTodoId={deletingTodoId}
        editTodoStatus={editTodoStatus}
        isToggle={isToggle}
        editTodoTitle={editTodoTitle}
        handleEditingId={handleEditingId}
        editingId={editingId}
      />
    ))}

    {tempTodo && (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>

        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
));
