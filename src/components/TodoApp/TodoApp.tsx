import React, { FormEvent, useState } from 'react';
import { TodoAppHeader } from '../TodoAppHeader/TodoAppHeader';
import { TodoAppMain } from '../TodoAppMain/TodoAppMain';
import { TodoAppFooter } from '../TodoAppFooter/TodoAppFooter';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { createTodo, deleteTodo, updateTodo } from '../../api/todos';
import { ErrorType } from '../../Enums/ErrorType';

type Props = {
  isLoading: boolean,
  todos: Todo[],
  allTodos: Todo[],
  setTodos: CallableFunction,
  user: User,
  sortBy: number,
  setSortBy: CallableFunction,
  setErrorType: CallableFunction,
};

export const TodoApp: React.FC<Props> = (props) => {
  const {
    isLoading,
    todos,
    allTodos,
    setTodos,
    user,
    sortBy,
    setSortBy,
    setErrorType,
  } = props;

  const [loadingTodosID, setLoadingTodosID] = useState<number[]>([]);

  const handleDeleteTodo = (todoId: number): void => {
    setErrorType(ErrorType.Default);

    setLoadingTodosID(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorType(ErrorType.Delete);
      });
  };

  const handleUpdateTodoStatus = (todo: Todo): void => {
    setErrorType(ErrorType.Default);

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
      .catch(() => {
        setErrorType(ErrorType.Update);
      })
      .finally(() => {
        setLoadingTodosID(prev => prev.filter(item => item !== todo.id));
      });
  };

  const handleRenameTodo = (todo: Todo, title: string): void => {
    setErrorType(ErrorType.Default);

    if (todo.title === title) {
      return;
    }

    if (title.trim().length <= 0) {
      handleDeleteTodo(todo.id);
    } else {
      setLoadingTodosID(prev => [...prev, todo.id]);

      updateTodo(todo.id, {
        title,
      })
        .then(() => {
          setTodos((prev: Todo[]) => prev.map(oldTodo => {
            if (oldTodo.id === todo.id) {
              return {
                ...oldTodo,
                title,
              };
            }

            return oldTodo;
          }));
        })
        .catch(() => {
          setErrorType(ErrorType.Update);
        })
        .finally(() => {
          setLoadingTodosID(prev => prev.filter(item => item !== todo.id));
        });
    }
  };

  const handleCreateTodo = async (event: FormEvent, title: string) => {
    setErrorType(ErrorType.Default);

    event.preventDefault();

    if (title.trim().length <= 0) {
      setErrorType(ErrorType.WrongTitle);

      return;
    }

    const optimisticResponseId = -(todos.length);
    const optimisticTodo = {
      id: optimisticResponseId,
      title,
      userId: user.id,
      completed: false,
    };

    setTodos((prev: Todo[]) => [...prev, optimisticTodo]);
    setLoadingTodosID(prev => [...prev, optimisticResponseId]);

    const createdTodo = await createTodo({
      title,
      userId: user.id,
      completed: false,
    })
      .catch(() => {
        setErrorType(ErrorType.Create);
      });

    setTodos((prev: Todo[]) => prev.map(todo => {
      return todo.id === optimisticResponseId
        ? createdTodo
        : todo;
    }));
  };

  const handleUpdateAllTodosStatus = (): void => {
    const isAllCompleted = todos.every(todo => todo.completed);

    if (isAllCompleted) {
      todos.forEach(todo => handleUpdateTodoStatus(todo));
    } else {
      todos.forEach(todo => {
        if (todo.completed === false) {
          handleUpdateTodoStatus(todo);
        }
      });
    }
  };

  const handleCompletedTodosClear = (): void => {
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

      {!isLoading && allTodos.length > 0 && (
        <>
          {todos.length > 0 && (
            <TodoAppMain
              todos={todos}
              handleDeleteTodo={handleDeleteTodo}
              handleRenameTodo={handleRenameTodo}
              handleUpdateTodoStatus={handleUpdateTodoStatus}
              loadingTodosID={loadingTodosID}
            />
          )}

          <TodoAppFooter
            todos={todos}
            sortBy={sortBy}
            setSortBy={setSortBy}
            handleCompletedTodosClear={handleCompletedTodosClear}
          />
        </>
      )}
    </div>
  );
};
