import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { TodoItem } from '../TodoItem/TodoItem';
import { useEffect, useRef } from 'react';

interface Props {
  todos: Todo[];
  loader: boolean;
  tempTodo: Todo | null;
  deletePosts: (b: Todo) => void;
  addActivePosts: (b: Todo) => void;
  loadTodos: number[];
  changeInputs: (b: Todo, c: string) => void;
  clickTodo: number | null;
  setChangeInput: (b: string) => void;
  changeInput: string;
  setClickTodo: (b: number) => void;
}

export const Main = ({
  todos,
  loader,
  tempTodo,
  deletePosts,
  addActivePosts,
  loadTodos,
  changeInputs,
  clickTodo,
  setChangeInput,
  changeInput,
  setClickTodo,
}: Props) => {
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (clickTodo !== null && inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [clickTodo]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 &&
        todos.map(todo => (
          <div
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
            key={todo.id}
          >
            <label
              className="todo__status-label"
              aria-labelledby={`todo_${todo.id}`}
            >
              <input
                id={`todo_${todo.id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onClick={() => {
                  addActivePosts(todo);
                }}
              />
            </label>

            {todo.id === clickTodo ? (
              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={changeInput}
                  onChange={event => setChangeInput(event.target.value)}
                  ref={inputFocus}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                    }

                    changeInputs(todo, event.key);
                  }}
                  onBlur={() => changeInputs(todo, 'Blur')}
                />
              </form>
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setChangeInput(todo.title);
                  setClickTodo(todo.id);
                }}
              >
                {todo.title}
              </span>
            )}

            {todo.id !== clickTodo && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  deletePosts(todo);
                }}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': loader && loadTodos.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

      {tempTodo && <TodoItem todo={tempTodo} loader={loader} />}
    </section>
  );
};
