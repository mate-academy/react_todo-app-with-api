import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType,
  todos: TodoType[],
  setTodos(todos: TodoType[]): void,
  setError(error: string): void,
};

export const Todo: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setError,
}) => {
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');

  const remove = () => {
    setTodos(todos.map(currentTodo => {
      if (currentTodo.id === todo.id) {
        return {
          ...currentTodo,
          loading: true,
        };
      }

      return { ...currentTodo };
    }));

    setError('');

    deleteTodo(todo.id).then(() => setTodos(todos
      .filter(currentTodo => currentTodo.id !== todo.id)))
      .catch(() => {
        setError('delete');

        setTodos(todos.map(currentTodo => ({
          ...currentTodo,
          loading: false,
        })));
      });
  };

  const update = (newTitle: string, newCompleted: boolean) => {
    setTodos(todos.map(currentTodo => {
      if (currentTodo.id === todo.id) {
        return {
          ...currentTodo,
          loading: true,
        };
      }

      return { ...currentTodo };
    }));

    setError('');

    updateTodo(todo.id, newCompleted, newTitle).then(() => setTodos(todos
      .map(currentTodo => {
        if (currentTodo.id === todo.id) {
          return {
            ...currentTodo,
            title: newTitle,
            completed: newCompleted,
            loading: false,
          };
        }

        return { ...currentTodo };
      }))).catch(() => {
      setError('update');

      setTodos(todos.map(currentTodo => ({
        ...currentTodo,
        loading: false,
      })));
    });
  };

  const handleSubmit = (event: React.FormEvent | React.FocusEvent): void => {
    event.preventDefault();

    if (!input) {
      remove();

      return;
    }

    if (input !== todo.title) {
      update(input, todo.completed);
    }

    setInput('');
    setTyping(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo?.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={() => update(todo.title, !todo.completed)}
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
                setInput(todo.title);
                setTyping(true);
              }}
            >
              {todo?.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={remove}
            >
              x
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': todo.loading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
