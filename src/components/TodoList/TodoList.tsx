import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { UpdateTodoArgs } from '../../types/UpdateTodoArgs';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  toggleTodoStatus:(
    todoId: number,
    args: UpdateTodoArgs
  ) => void;
  updatingTodosId: number[];
  updateTodoTitle: (todoId: number, args: UpdateTodoArgs) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  toggleTodoStatus,
  updatingTodosId,
  updateTodoTitle,

}) => {
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main">

      {todos.map(todo => (
        <TodoItem
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
          toggleTodoStatus={toggleTodoStatus}
          updatingTodosId={updatingTodosId}
          selectedTodoId={selectedTodoId}
          setSelectedTodoId={setSelectedTodoId}
          updateTodoTitle={updateTodoTitle}
        />
      ))}

      {tempTodo && (

        <div
          className={cn(
            'todo',
            { completed: tempTodo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>
          <span className="todo__title">{tempTodo.title}</span>

          <button
            type="button"
            className="todo__remove"
          >
            ×

          </button>

          <div
            className={cn(
              'modal overlay',
              { ' is-active': tempTodo },
            )}
          >
            <div className="modal-background has-background-white-ter " />
            <div className="loader " />
          </div>
        </div>

      )}

    </section>
  );
};
