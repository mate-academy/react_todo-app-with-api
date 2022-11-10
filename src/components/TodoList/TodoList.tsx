import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number, reload: boolean) => Promise<void>;
  loadingTodos: number[];
  addLoadingTodo: (id: number) => void;
  changeTodoCompleted: (id: number, todoServer: Todo) => Promise<void>;
};

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  loadingTodos,
  addLoadingTodo,
  changeTodoCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const {
          id,
          completed,
          title,
        } = todo;

        return (
          <div
            data-cy="Todo"
            className={cn('todo', {
              completed,
            })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                defaultChecked
                onClick={async () => {
                  addLoadingTodo(id);
                  await changeTodoCompleted(id, {
                    ...todo,
                    completed: !completed,
                  });
                }}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={async () => {
                addLoadingTodo(id);
                await deleteTodo(id, true);
              }}
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
            {loadingTodos.includes(id) && (
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};
