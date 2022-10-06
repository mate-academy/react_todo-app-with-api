import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import classNames from 'classnames';
import { Dispatch, SetStateAction, useState } from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  toggleAll: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setError,
  setErrorMessage,
  toggleAll,
}) => {
  const [isActive, setActive] = useState(false);

  const handleDelete = () => {
    setActive(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter(tod => tod.id !== todo.id));
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to delete a todo');
      });
  };

  const handleStatus = () => {
    setActive(true);
    const todoId = todo.id;
    const todoIndex = todos.findIndex(foundTodo => {
      return foundTodo.id === todo.id;
    });

    const updatedTodos = [...todos];

    updateTodo(todoId, { completed: !todo.completed })
      .then(() => {
        setActive(false);
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to update a todo');
      });

    updatedTodos[todoIndex].completed = !todo.completed;

    setTodos(updatedTodos);
  };

  return (
    <TransitionGroup>
      <CSSTransition
        key={todo.id}
        timeout={300}
        classNames="item"
      >
        <div
          data-cy="Todo"
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={handleStatus}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDelete}
          >
            ×
          </button>

          {(isActive || toggleAll) && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
