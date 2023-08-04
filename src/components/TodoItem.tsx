import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { TodoError } from '../types/TodoError';

type Props = {
  todo: Todo,
  todos?: Todo[],
  toggleTodoStatus: (todo: Todo) => void,
  setTodosFromServer: React.Dispatch<React.SetStateAction<Todo[]>>,
  newAddedTodoId: number | null,
  setErrorMesage: (error: TodoError) => void,
  setSelectedTodoId: (id: number | null) => void,
  selectedTodoId: number | null,
  changedStatusIds: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  toggleTodoStatus,
  setTodosFromServer,
  newAddedTodoId,
  setErrorMesage,
  setSelectedTodoId,
  selectedTodoId,
  changedStatusIds,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editedTodoId]);

  const deleteTodo = useCallback((todoId: number) => {
    setSelectedTodoId(todoId);
    if (todos) {
      setTimeout(() => setTodosFromServer(
        todos.filter(deletedTodo => deletedTodo.id !== todoId),
      ), 300);
    }

    return todoService.deleteTodo(String(todoId))
      .catch((error) => {
        if (todos) {
          setTodosFromServer(todos);
        }

        setErrorMesage(TodoError.delete);
        throw error;
      }).finally(() => setSelectedTodoId(null));
  }, [todos]);

  const updateTodoTitle = useCallback(async ({
    id,
    title,
    userId,
    completed,
  }: Todo) => {
    try {
      const newTodos = todos?.map(newTodo => {
        if (newTodo.id === id) {
          setSelectedTodoId(newTodo.id);

          return { ...todo, title };
        }

        return todo;
      });

      await todoService.updateTodo({
        id,
        title,
        userId,
        completed,
      });
      setEditedTodoId(null);

      if (newTodos) {
        setTodosFromServer(newTodos);
      }
    } catch {
      setErrorMesage(TodoError.update);

      if (todos) {
        setTodosFromServer(todos);
      }
    } finally {
      setSelectedTodoId(null);
    }
  }, [todos]);

  const saveChanges = (newTodo: Todo) => {
    if (newTitle.trim() === newTodo.title) {
      setEditedTodoId(null);

      return;
    }

    if (newTitle.trim() === '') {
      deleteTodo(newTodo.id);
    }

    if (newTitle.trim() !== '') {
      updateTodoTitle({ ...newTodo, title: newTitle });
    }
  };

  const submitChanges = (
    event: React.KeyboardEvent<HTMLInputElement>,
    newTodo: Todo,
  ) => {
    if (event.key === 'Enter') {
      saveChanges(newTodo);
    }
  };

  const handleDoudleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    newTodo: Todo,
  ) => {
    if (event.detail === 2) {
      setEditedTodoId(newTodo.id);
      setNewTitle(newTodo.title);
    }
  };

  const cancelChanges = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setEditedTodoId(null);
    }
  };

  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoStatus(todo)}
        />
      </label>
      {
        editedTodoId === todo.id ? (
          <input
            type="text"
            className="todoapp__new-todo"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onKeyDown={(event) => submitChanges(event, todo)}
            onKeyUp={cancelChanges}
            onBlur={() => saveChanges(todo)}
            ref={inputRef}
          />
        )
          : (
            <>
              {/* eslint-disable-next-line */}
              <span
                className="todo__title"
                onClick={(event) => handleDoudleClick(event, todo)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )
      }
      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active': todo.id === selectedTodoId
            || todo.id === newAddedTodoId
            || changedStatusIds?.includes(todo.id),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
