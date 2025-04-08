/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Loader } from '../Loader/Loader';
import { Todo } from '../../types/Todo';
import { EditForm } from './EditForm';

import { deleteTodo, changeTodoParams } from '../../api/todos';
import { ERROR, TempTodoAction } from '../../types/enums';

import cn from 'classnames';

type Props = {
  todo: Todo;
  loadingList: {
    adIdToLoadingList: (id: number) => void;
    removeIdFromLoadingList: (id: number) => void;
  };
  onError: (message: ERROR) => void;
  setTodos: (callback: (prev: Todo[]) => Todo[]) => void;
  isLoading: boolean;
  setTempTodo: (
    tempTodo: {
      type: TempTodoAction;
      todo?: Todo;
      todoId?: Todo['id'];
    } | null,
  ) => void;
};

const TodoItemComponent: React.FC<Props> = ({
  todo,
  loadingList,
  onError,
  setTodos,
  isLoading,
  setTempTodo,
}) => {
  const [edit, setEdit] = useState(false);
  const [todoTitle, setTodoTitle] = useState<string>(todo.title);
  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editField.current?.focus();
  }, [edit]);

  const deleteItem = useCallback(async (id: number) => {
    try {
      loadingList.adIdToLoadingList(id);
      const resp = await deleteTodo(id);

      setTempTodo({ type: TempTodoAction.remove, todoId: todo.id });

      if (!resp) {
        throw new Error(ERROR.delete);
      }

      setTodos(prev => prev.filter(item => todo.id !== item.id));
    } catch (error) {
      onError(ERROR.delete);
    } finally {
      setTempTodo(null);
      loadingList.removeIdFromLoadingList(id);
      setEdit(false);
    }
  }, []);

  const updateTodo = async (id: Todo['id'], newData: Partial<Todo>) => {
    loadingList.adIdToLoadingList(id);

    try {
      const resp = await changeTodoParams(id, newData);

      setTodos(prev =>
        prev.map(item => {
          if (todo.id === item.id) {
            return { ...item, ...newData };
          }

          return item;
        }),
      );
      if (!resp) {
        setTodos(prev => [...prev, todo]);
        throw new Error(ERROR.update);
      }

      setEdit(false);
    } catch (error) {
      onError(ERROR.update);
    } finally {
      loadingList.removeIdFromLoadingList(id);
    }
  };

  const onFormSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    const newTitle = todoTitle.trim();

    if (todo.title === newTitle) {
      setEdit(false);

      return;
    }

    if (newTitle === '') {
      try {
        await deleteItem(todo.id);
      } catch {
        setEdit(true);
      }

      return;
    }

    updateTodo(todo.id, { title: newTitle });
  };

  const closeEditWithoutChange = (
    event?: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!event || event.code === 'Escape') {
      setEdit(false);
      setTodoTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>
      {edit ? (
        <EditForm
          onFormSubmit={onFormSubmit}
          todoTitle={todoTitle}
          editField={editField}
          setTodoTitle={setTodoTitle}
          closeEditWithoutChange={closeEditWithoutChange}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEdit(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteItem(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <Loader loading={isLoading} />
    </div>
  );
};

export const TodoItem = React.memo(TodoItemComponent);
