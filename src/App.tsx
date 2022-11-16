/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorType } from './types/ErrorType';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<ErrorType>(ErrorType.NONE);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [newTitile, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getTodosWithUsers = useCallback(async () => {
    if (user) {
      try {
        const todoswithUser = await getTodos(user.id);

        setTodos(todoswithUser);
      } catch {
        setTimeout(() => {
          throw new Error('User todo not found');
        }, 3000);
      }
    }
  }, []);

  useEffect(() => {
    getTodosWithUsers();
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return todo;
    }
  });

  const addNewTodo = async (title: string) => {
    if (user) {
      setIsAdding(true);

      const newTodo = {
        userId: user.id,
        title,
        completed: false,
      };

      try {
        await addTodo(newTodo);
      } catch {
        setErrors(ErrorType.ADD);
      }

      setIsAdding(false);
      getTodosWithUsers();
    }
  };

  const deleteSingleTodo = async (todoId: number) => {
    if (user) {
      try {
        await deleteTodo(todoId);
        await getTodosWithUsers();
      } catch {
        setErrors(ErrorType.DELETE);
      }
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      const completedTodos = todos.filter((todo) => todo.completed);

      completedTodos.forEach(todo => {
        deleteSingleTodo(todo.id);
      });
    } catch (error) {
      setErrors(ErrorType.DELETE);
    }

    await getTodosWithUsers();
  };

  const changeTodoTitle = async (todoId: number, newTitle: string) => {
    try {
      await updateTodo(todoId, { title: newTitle });
      await getTodosWithUsers();
    } catch {
      setErrors(ErrorType.UPDATE);
    }
  };

  const changeTodoStatus = async (todo: Todo) => {
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      await getTodosWithUsers();
    } catch (error) {
      setErrors(ErrorType.UPDATE);
    }
  };

  const toggleAllTodos = async () => {
    const notCompletedTodos = todos.filter((todo) => !todo.completed);

    try {
      if (notCompletedTodos.length > 0) {
        notCompletedTodos.forEach(todo => {
          changeTodoStatus(todo);
        });
      } else if (!notCompletedTodos.length) {
        todos.forEach(todo => {
          changeTodoStatus(todo);
        });
      }
    } catch (error) {
      setErrors(ErrorType.UPDATE);
    }

    await getTodosWithUsers();
  };

  const allToggled = () => {
    const toggledTodos = todos.filter(todo => todo.completed).length;

    return (toggledTodos === todos.length);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todosLength={todos.length}
          newTitile={newTitile}
          setNewTitle={setNewTitle}
          addNewTodo={addNewTodo}
          setErrors={setErrors}
          isAdding={isAdding}
          allToggled={allToggled}
          toggleAllTodos={toggleAllTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              deleteTodo={deleteSingleTodo}
              changeTodoTitle={changeTodoTitle}
              changeTodoStatus={changeTodoStatus}
            />

            <Footer
              todos={visibleTodos}
              setFilter={setFilter}
              filter={filter}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      {errors !== ErrorType.NONE && (
        <Errors
          setErrors={setErrors}
          errors={errors}
        />
      )}
    </div>
  );
};
