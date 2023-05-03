import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { deleteTodos, updateTodos } from '../api/todos';
import { TodoItemTitle } from './TodoItemTitle';
import { TodoItemForm } from './TodoItemForm';
import { TodoLoader } from './TodoLoader';
import { USER_ID } from '../api/userId';
import { ErrorType } from '../types/ErrorType';

type TodoListProps = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filter: Filter,
  showErrorNotification: (error: string) => void,
  todos: Todo[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean,
  setLoadingActiveTodoId: React.Dispatch<React.SetStateAction<number[]>>,
  loadingActiveTodoId: number[],
};

export const TodoList: React.FC<TodoListProps> = ({
  setTodos,
  filter,
  showErrorNotification,
  todos,
  setLoading,
  loading,
  setLoadingActiveTodoId,
  loadingActiveTodoId,
}) => {
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleTodoDelete = async (todoId: number) => {
    try {
      setLoadingActiveTodoId(prev => [...prev, todoId]);
      setLoading(true);
      await deleteTodos(USER_ID, todoId);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      showErrorNotification(ErrorType.DeleteTodosError);
    } finally {
      setLoadingActiveTodoId([]);
      setLoading(false);
    }
  };

  const handleTodoCheck = async (idTodo: number) => {
    const updatedTodo = todos.find((todo) => todo.id === idTodo) || null;

    if (!updatedTodo) {
      throw new Error('Todo not found');
    }

    try {
      setLoadingActiveTodoId([idTodo]);
      setLoading(true);
      updatedTodo.completed = !updatedTodo.completed;
      await updateTodos(USER_ID, idTodo, updatedTodo);
      setTodos((prev) => prev
        .map((todo) => (todo.id === idTodo ? updatedTodo : todo)));
    } catch (error) {
      showErrorNotification(ErrorType.UpdateTodosError);
    } finally {
      setLoading(false);
      setLoadingActiveTodoId([]);
    }
  };

  const handleTitleBlur = async (todoId: number) => {
    setLoading(true);
    setActiveTodoId(null);
    setLoadingActiveTodoId(prev => [...prev, todoId]);

    const updatedTodo = todos
      .find((todoItem) => todoItem.id === todoId) || null;

    if (!updatedTodo) {
      throw new Error('Todo not found');
    }

    updatedTodo.title = newTitle;

    try {
      if (!updatedTodo.title) {
        await handleTodoDelete(todoId);
      } else {
        await updateTodos(USER_ID, todoId, updatedTodo);
      }
    } catch (error) {
      showErrorNotification(ErrorType.UpdateTodosError);
    } finally {
      setLoading(false);
      setLoadingActiveTodoId([]);
      setNewTitle('');
    }
  };

  const handleNewTitleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    todoId: number,
  ) => {
    event.preventDefault();
    setActiveTodoId(null);
    setLoading(true);
    setLoadingActiveTodoId(prev => [...prev, todoId]);
    const updatedTodo = todos
      .find((todoItem) => todoItem.id === todoId) || null;

    if (!updatedTodo) {
      throw new Error('Todo not found');
    }

    try {
      if (!newTitle) {
        await handleTodoDelete(todoId);
      } else {
        await updateTodos(USER_ID, todoId, updatedTodo);
        updatedTodo.title = newTitle;
      }
    } catch (error) {
      showErrorNotification(ErrorType.UpdateTodosError);
    } finally {
      setLoading(false);
      setLoadingActiveTodoId([]);
      setNewTitle('');
    }
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    setNewTitle(event.target.value);
  };

  return (
    <section className="todoapp__main">
      {filteredTodos.map((todo) => (
        <div
          key={todo.id}
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleTodoCheck(todo.id)}
            />
          </label>
          {activeTodoId !== todo.id ? (
            <TodoItemTitle
              todo={todo}
              setActiveTodoId={setActiveTodoId}
              handleTodoDelete={handleTodoDelete}
            />
          ) : (
            <TodoItemForm
              handleNewTitleSubmit={handleNewTitleSubmit}
              todo={todo}
              handleTodoTitleChange={handleTodoTitleChange}
              handleTitleBlur={() => handleTitleBlur(todo.id)}
            />
          )}
          {loading && (
            <TodoLoader
              todo={todo}
              loadingActiveTodoId={loadingActiveTodoId}
            />
          )}
        </div>
      ))}
    </section>
  );
};
