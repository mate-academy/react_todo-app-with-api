import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoError } from '../types/TodoError';
import * as todoService from '../api/todos';

type Props = {
  todos: Todo[],
  setTodosFromServer: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMesage: (error: TodoError) => void,
  newAddedTodoId: number | null,
  selectedTodoId: number | null,
  setSelectedTodoId: (id: number | null) => void,
  toggleTodoStatus: (todo: Todo) => void,
  changedStatusIds: number[],
};

export const Main: React.FC<Props> = ({
  todos,
  setErrorMesage,
  setTodosFromServer,
  newAddedTodoId,
  selectedTodoId,
  setSelectedTodoId,
  toggleTodoStatus,
  changedStatusIds,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    todoService
      .getTodos(todoService.USER_ID)
      .then(allTodos => setTodosFromServer(allTodos))
      .catch(() => setErrorMesage(TodoError.load));

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editedTodoId]);

  const deleteTodo = (todoId: number) => {
    setSelectedTodoId(todoId);

    setTimeout(() => setTodosFromServer(
      todos.filter(todo => todo.id !== todoId),
    ), 300);

    return todoService.deleteTodo(String(todoId))
      .catch((error) => {
        setTodosFromServer(todos);
        setErrorMesage(TodoError.delete);
        throw error;
      }).finally(() => setSelectedTodoId(null));
  };

  const updateTodoTitle = async ({
    id,
    title,
    userId,
    completed,
  }: Todo) => {
    try {
      const newTodos = todos.map(todo => {
        if (todo.id === id) {
          setSelectedTodoId(todo.id);

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
      setTodosFromServer(newTodos);
    } catch {
      setErrorMesage(TodoError.update);
      setTodosFromServer(todos);
    } finally {
      setSelectedTodoId(null);
    }
  };

  const handleDoudleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    todo: Todo,
  ) => {
    if (event.detail === 2) {
      setEditedTodoId(todo.id);
      setNewTitle(todo.title);
    }
  };

  const saveChanges = (todo: Todo) => {
    if (newTitle.trim() === todo.title) {
      setEditedTodoId(null);

      return;
    }

    if (newTitle.trim() !== '') {
      updateTodoTitle({ ...todo, title: newTitle });
    } else {
      setErrorMesage(TodoError.emtyTitle);
    }
  };

  const submitChanges = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    if (event.key === 'Enter') {
      saveChanges(todo);
    }
  };

  const cancelChanges = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setEditedTodoId(null);
    }
  };

  return (
    <section className="todoapp__main">
      {
        todos.map(todo => (
          <div
            key={todo.id}
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
                  onKeyUp={(event) => cancelChanges(event)}
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
                  || changedStatusIds.includes(todo.id),
              },
            )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))
      }
    </section>
  );
};
