import {
  Dispatch,
  FC, LegacyRef, SetStateAction, useEffect, useState,
} from 'react';
import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { TodoItem } from './TodoItem';

interface Props {
  user: User,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessages: Dispatch<SetStateAction<string []>>,
  newTodoField: LegacyRef<HTMLInputElement> | undefined,
}

export const TodoList: FC<Props> = (props) => {
  const {
    user, todos, setTodos, setErrorMessages, newTodoField,
  } = props;

  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    setIsloading(true);
    setErrorMessages([]);

    getTodos(user.id)
      .then(setTodos)
      .catch((error) => {
        setErrorMessages((prev: string []) => [...prev, error.message]);
      })
      .finally(() => setIsloading(false));
  }, [setErrorMessages, setTodos, user]);

  return (
    <>
      {!isLoading && (
        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              todos={todos}
              newTodoField={newTodoField}
              setTodos={setTodos}
            />
          ))}

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">Redux</span>
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
        </section>
      )}
    </>
  );
};
