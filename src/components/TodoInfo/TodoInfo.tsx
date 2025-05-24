import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  focusedTodo: Todo | null;
  todo: Todo;
  todos: Todo[];
  errorMessage: string;
  setFocusedTodo: (todo: Todo | null) => void;
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  focusedTodo,
  todos,
  setTodos,
  setErrorMessage,
  setFocusedTodo,
  inputRef,
}) => {
  const { id, title, completed } = todo;
  const [todoLoading, setTodoLoading] = useState(false);
  const [inputText, setInputText] = useState(title);
  const focusedCurrInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedCurrInput.current) {
      focusedCurrInput.current?.focus();
    }
  }, [focusedTodo]);

  useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setFocusedTodo(null);
      }
    };

    document.addEventListener('keydown', callback);

    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [setFocusedTodo]);

  const completeTodo = (idUpdate: number) => {
    const findTodo = todos.find(item => item.id === idUpdate);
    const updatedTodos = todos.map(item => {
      if (item.id === idUpdate) {
        return { ...item, completed: !item.completed };
      }

      return item;
    });

    setTodoLoading(true);

    if (findTodo) {
      const updatedTodo: Todo = { ...findTodo, completed: !findTodo.completed };

      updateTodo(updatedTodo)
        .then(() => {
          setTodoLoading(false);
          setTodos(updatedTodos);
        })
        .catch(() => {
          setTodoLoading(false);
          setErrorMessage('Unable to update a todo');
        });
    }
  };

  const removeTodo = (todoId: number) => {
    setTodoLoading(true);

    deleteTodo(todoId)
      .then(() => {
        const filterTodos: Todo[] = todos.filter(
          someTodo => someTodo.id !== todoId,
        );

        setTodos(filterTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTodoLoading(false);

        inputRef.current?.focus();
      });
  };

  const doubleClickHandler = () => {
    setFocusedTodo(todo);
  };

  const updateTextTodo = (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>,
  ) => {
    e.preventDefault();
    setFocusedTodo(null);

    if (title === inputText.trim()) {
      return;
    }

    setTodoLoading(true);

    if (inputText.trim().length === 0) {
      deleteTodo(id)
        .then(() => {
          const filterTodos: Todo[] = todos.filter(
            someTodo => someTodo.id !== id,
          );

          setTodos(filterTodos);
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
          setInputText(title);
          setTodoLoading(false);
          setFocusedTodo(todo);
        })
        .finally(() => {
          inputRef.current?.focus();
        });

      return;
    }

    const updatedTodos = todos.map(item => {
      if (item.id === id) {
        return { ...item, title: inputText.trim() };
      } else {
        return item;
      }
    });

    updateTodo({ ...todo, title: inputText.trim() })
      .then(() => {
        setTodoLoading(false);
        setTodos(updatedTodos);
        setInputText(inputText.trim());
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setInputText(title);
        setTodoLoading(false);
        setFocusedTodo(todo);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => completeTodo(id)}
        />
        {''}
      </label>

      {focusedTodo && focusedTodo.id === id ? (
        <form onSubmit={updateTextTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            ref={focusedCurrInput}
            onBlur={updateTextTodo}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={doubleClickHandler}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
