import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { ErrorTitle } from '../types/TodoErrors';

type Props = {
  todo: Todo;
  setToodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage(val: string): void;
  setIsSubmitting(val: boolean): void;
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  loader: Record<number, boolean>;
  fakeTodoActive?: boolean | undefined;
  handlerUpdateTodo?(todo: Todo): Promise<void>;
};

const TodoItem: React.FC<Props> = ({
  todo,
  setToodos,
  setErrorMessage,
  setIsSubmitting,
  setLoader,
  loader,
  fakeTodoActive,
  handlerUpdateTodo,
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const editableInputRef = useRef<HTMLInputElement>(null);
  const [queryTodo, setQueryTodo] = useState<string>(todo.title);

  function handlerDeleteTodo(todoId: number) {
    setLoader((prevLoader) => ({
      ...prevLoader,
      [todoId]: true,
    }));
    setIsSubmitting(true);
    deleteTodo(todoId)
      .then(() => {
        setToodos((currentTodos) => {
          const updatedTodos = currentTodos.filter(
            (currentTodo) => currentTodo.id !== todoId,
          );

          return updatedTodos;
        });
      })
      .catch(() => setErrorMessage(ErrorTitle.Delete))
      .finally(() => {
        setIsSubmitting(false);
        setLoader((prevLoader) => ({
          ...prevLoader,
          [todoId]: false,
        }));
      });
  }

  const handleToggle = () => {
    handlerUpdateTodo?.({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (queryTodo.trim() === '') {
      handlerDeleteTodo(todo.id);
    }

    if (handlerUpdateTodo) {
      if (queryTodo === todo.title) {
        setIsEditable(false);

        return;
      }

      handlerUpdateTodo?.({
        ...todo,
        title: queryTodo.trim(),
      }).then(() => {
        setIsEditable(false);
      });
    }
  };

  const hanlerKeyUp = (
    event: React.KeyboardEvent,
    todoId: number,
    todoText: string,
  ) => {
    if (event.key === 'Escape') {
      setIsEditable(false);

      if (todoText === '') {
        handlerDeleteTodo(todoId);
      }
    }
  };

  const onBlurInp = (todoText: string) => {
    if (todoText.trim() === '') {
      handlerDeleteTodo(todo.id);
    }

    handlerUpdateTodo?.({
      ...todo,
      title: queryTodo.trim(),
    });
    setIsEditable(false);
  };

  useEffect(() => {
    if (editableInputRef.current) {
      editableInputRef.current.focus();
    }
  }, [isEditable]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {isEditable ? (
        <>
          <form onSubmit={handlerSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={queryTodo}
              onChange={(e) => setQueryTodo(e.target.value)}
              ref={editableInputRef}
              onBlur={() => onBlurInp(queryTodo)}
              onKeyUp={(event) => hanlerKeyUp(event, todo.id, queryTodo)}
            />
          </form>
        </>
      ) : (
        <>
          <span
            onDoubleClick={() => {
              setIsEditable(true);
            }}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            onClick={() => handlerDeleteTodo(todo.id)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loader[todo.id] || fakeTodoActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
