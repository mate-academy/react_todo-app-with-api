import React, { useState } from 'react';
import { TodoAppHeader } from '../TodoAppHeader/TodoAppHeader';
import { TodoAppMain } from '../TodoAppMain/TodoAppMain';
import { TodoAppFooter } from '../TodoAppFooter/TodoAppFooter';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { createTodo, deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  setTodos: CallableFunction,
  user: User,
  sortBy: number,
  setSortBy: CallableFunction,
  isLoading: boolean,
};

export const TodoApp: React.FC<Props> = (props) => {
  const {
    todos,
    setTodos,
    user,
    sortBy,
    setSortBy,
    isLoading,
  } = props;

  const [loadingTodosID, setLoadingTodosID] = useState<number[]>([]);

  const handleDeleteTodo = (todoId: number): void => {
    setLoadingTodosID(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== todoId));
      })
      .finally(() => {
        setLoadingTodosID(prev => prev.filter(item => item !== todoId));
      });
  };

  const handleUpdateTodoStatus = (todo: Todo): void => {
    setLoadingTodosID(prev => [...prev, todo.id]);

    updateTodo(todo.id, {
      completed: !todo.completed,
    })
      .then(() => {
        setTodos((prev: Todo[]) => prev.map(oldTodo => {
          if (oldTodo.id === todo.id) {
            return {
              ...oldTodo,
              completed: !oldTodo.completed,
            };
          }

          return oldTodo;
        }));
      })
      .finally(() => {
        setLoadingTodosID(prev => prev.filter(item => item !== todo.id));
      });
  };

  const handleRenameTodo = (todoId: number, title: string): void => {
    setLoadingTodosID(prev => [...prev, todoId]);

    updateTodo(todoId, {
      title,
    })
      .then(() => {
        setTodos((prev: Todo[]) => prev.map(oldTodo => {
          if (oldTodo.id === todoId) {
            return {
              ...oldTodo,
              title,
            };
          }

          return oldTodo;
        }));
      })
      .finally(() => {
        setLoadingTodosID(prev => prev.filter(item => item !== todoId));
      });
  };

  const handleCreateTodo = (title: string): void => {
    createTodo({
      title,
      userId: user.id,
      completed: false,
    })
      .then((newTodo) => {
        setTodos((prev: Todo[]) => [...prev, newTodo]);
      });
  };

  const handleUpdateAllTodosStatus = (): void => {
    setLoadingTodosID([...todos.map(todo => todo.id)]);

    const isAllCompleted = todos.every(todo => todo.completed);
    // const uncompletedTodos = todos.filter(todo => !todo.completed);

    todos.forEach(todo => {
      updateTodo(todo.id, { completed: !isAllCompleted })
        .then(() => {
          setTodos((prev: Todo[]) => prev.map(oldTodo => {
            return {
              ...oldTodo,
              completed: !isAllCompleted,
            };
          }));
        })
        .finally(() => {
          setLoadingTodosID([]);
        });
    });
  };

  const handleTodosClear = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  return (
    <div className="todoapp__content">
      <TodoAppHeader
        todos={todos}
        handleUpdateAllTodosStatus={handleUpdateAllTodosStatus}
        handleCreateTodo={handleCreateTodo}
      />
      {!isLoading && todos.length > 0 && (
        <>
          <TodoAppMain
            todos={todos}
            handleDeleteTodo={handleDeleteTodo}
            handleRenameTodo={handleRenameTodo}
            handleUpdateTodoStatus={handleUpdateTodoStatus}
            loadingTodosID={loadingTodosID}
          />

          <TodoAppFooter
            todos={todos}
            sortBy={sortBy}
            setSortBy={setSortBy}
            handleTodosClear={handleTodosClear}
          />
        </>
      )}
    </div>
  );
};
