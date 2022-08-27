import React, { useContext } from 'react';
import { Maybe } from '../types/Maybe';
import { Todo, UpdateTodoframent } from '../types/Todo';
import { StateContext } from './StateContext';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Maybe<Todo[]>;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, data: UpdateTodoframent) => void;
}

export const TodoList: React.FC<Props> = React.memo((props) => {
  const { todos, onDelete, onUpdate } = props;

  const { isSavingTodo, todoTitle } = useContext(StateContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos && todos.length > 0 && todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
      {isSavingTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{todoTitle}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
});
