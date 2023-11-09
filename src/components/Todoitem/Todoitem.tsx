import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos, updateTodo } from '../../api/todos';
import { Errors } from '../../types/Error';
import { Toggler } from '../../types/toggle';
/* eslint-disable max-len */

interface Props {

  todo: Todo,
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  setError: (value: string) => void,
  cleared: boolean
  toggled: string
}

export const Todoitem: React.FC<Props> = ({
  todo, todos, setTodos, setError, cleared, toggled,
}) => {
  const [loader, setloader] = useState(false);

  const handleDelete = (id: number | undefined) => {
    if (id) {
      setloader(true);
      deleteTodos(id)
        .then(() => {
          setTodos(todos.filter(stodo => stodo.id !== id));
        })
        .catch(() => setError(Errors.unableDelete))
        .finally(() => setloader(false));
    }
  };

  const handleCheck = (id: number | undefined, htodo: Todo) => {
    if (id) {
      setloader(true);

      updateTodo(id, { completed: !todo.completed })
        .then(
          (rtodo) => {
            const uTodos = [...todos];
            const index = uTodos.findIndex(uTodo => uTodo.id === htodo.id);

            uTodos.splice(index, 1, rtodo);
            setTodos([...uTodos]);
          },
        ).catch(() => setError(Errors.unablechange)).finally(() => setloader(false));
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          onChange={() => handleCheck(todo.id, todo)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': (loader)
            || (cleared && todo.completed)
            || (toggled === Toggler.completed && !todo.completed)
            || (toggled === Toggler.incompleted && todo.completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
