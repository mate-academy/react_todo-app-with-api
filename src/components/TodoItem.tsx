import classNames from 'classnames';
import {
  FC, useState,
} from 'react';
import { updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  todos: Todo[],
  setTodos(todos: Todo[]): void,
  setError(error: string): void,
  loading: boolean,
  activeTodoId: number | null,
  remove(todoId: number): void,
}

export const TodoItem: FC<Props> = ({
  todo,
  todos,
  setTodos,
  setError,
  loading,
  activeTodoId,
  remove,
}) => {
  const { title, id, completed } = todo;

  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');

  const update = async (newTitle: string, newCompleted: boolean) => {
    setTodos(todos.map(currentTodo => {
      if (currentTodo.id === id) {
        return {
          ...currentTodo,
          completed: newCompleted,
          title: newTitle,
        };
      }

      return { ...currentTodo };
    }));

    try {
      await updateTodo(id, newCompleted, newTitle);

      const myTodo = todos.map(currentTodo => {
        if (currentTodo.id === id) {
          return {
            ...currentTodo,
            title: newTitle,
            completed: newCompleted,
          };
        }

        return { ...currentTodo };
      });

      setTodos(myTodo);
    } catch {
      setError('update');
    }

    // await updateTodo(id, newCompleted, newTitle)
    //   .then(() => {
    //     setTodos(todos
    //       .map(currentTodo => {
    //         if (currentTodo.id === id) {
    //           return {
    //             ...currentTodo,
    //             title: newTitle,
    //             completed: newCompleted,
    //           };
    //         }

    //         return { ...currentTodo };
    //       }),
    //     ),
    //   })
    //   .catch(() => {
    //     setError('update');
    //   });
  };

  const handleSubmit = (event: React.FormEvent | React.FocusEvent): void => {
    event.preventDefault();

    if (!input) {
      remove(id);

      return;
    }

    setError('');

    if (input !== todo.title) {
      update(input, todo.completed);
    }

    setTyping(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => update(title, !completed)}
        />
      </label>

      {typing
        ? (
          <form
            onBlur={handleSubmit}
            onSubmit={handleSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="Empty todo will be deleted"
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  setInput('');
                  setTyping(false);
                }
              }}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setInput(title);
                setTyping(true);
              }}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => remove(id)}
            >
              x
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': loading && id === activeTodoId },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
