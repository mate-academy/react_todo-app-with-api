/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodos, getTodos } from './api/todos';
import { Header } from './components/Header';
import { Error } from './components/Error';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Error';
import { TodoStatus } from './types/TodoStatus';
import { useErrorHandler } from './hooks/useErrorHandler';
import { updateTodos } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const { error, handleError } = useErrorHandler();
  const [loading, setLoading] = useState<number[]>([]);

  const receiveData = async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch (err) {
      handleError(ErrorType.loading_error, 3000);
    }
  };

  const updateTodoStatus = (id: number, completed: boolean) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, completed } : todo)),
    );
  };

  const deleteItemFromTodos = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const clearAllCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setLoading(completedTodosIds);

    try {
      const deleteRequests = completedTodosIds.map(async todoId => {
        try {
          await deleteTodos(todoId);
          deleteItemFromTodos(todoId);
        } catch {
          handleError(ErrorType.delete_error, 3000);
        }
      });

      await Promise.allSettled(deleteRequests);
    } catch {
      handleError(ErrorType.delete_error, 3000);
    } finally {
      setLoading([]);
    }
  };

  const onUpdateAllTodosStatus = async (areAllCompleted: boolean) => {
    const activeTodos = todos.filter(todo => !todo.completed);
    const activeTodosIds = activeTodos.map(todo => todo.id);
    const todosToUpdate = areAllCompleted ? todos : activeTodos;

    setLoading(activeTodosIds);

    try {
      await Promise.allSettled(
        todosToUpdate.map(todo =>
          updateTodos(todo.id, { completed: !areAllCompleted }),
        ),
      );

      setTodos(prevTodos =>
        prevTodos.map(todo => ({
          ...todo,
          completed: !areAllCompleted,
        })),
      );
    } catch {
      handleError(ErrorType.update_error, 3000);
    } finally {
      setLoading([]);
    }
  };

  const onEditTodoTitle = async (
    id: number,
    titleEdited: string,
    setIsEditing: Dispatch<SetStateAction<boolean>>,
  ) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    const newTitle = titleEdited.trim();

    if (!todoToUpdate) {
      handleError(ErrorType.loading_error, 3000);

      return;
    }

    if (newTitle === '') {
      setLoading(prev => [...prev, todoToUpdate.id]);
      try {
        await deleteTodos(id);
        deleteItemFromTodos(id);
      } catch {
        handleError(ErrorType.delete_error);
      } finally {
        setLoading(prev => prev.filter(loadingId => loadingId !== id));
      }

      return;
    }

    if (newTitle !== todoToUpdate.title) {
      setLoading(prev => [...prev, todoToUpdate.id]);

      try {
        await updateTodos(id, { ...todoToUpdate, title: newTitle });

        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, title: newTitle } : todo,
          ),
        );

        setIsEditing(false);
      } catch {
        handleError(ErrorType.update_error, 3000);
      } finally {
        setLoading(prev => prev.filter(loadingId => loadingId !== id));
      }
    } else {
      setIsEditing(false);
    }
  };

  const filterData = (filterBy: TodoStatus) => {
    switch (filterBy) {
      case TodoStatus.active:
        return todos.filter(todo => !todo.completed);

      case TodoStatus.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const visibleTodos = filterData(filter);


  useEffect(() => {
    receiveData();
  }, []);

  return (
    <div className="todoapp">
      {!USER_ID ? (
        <UserWarning />
      ) : (
        <>
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              setTodos={setTodos}
              todos={todos}
              setError={handleError}
              setTempTodo={setTempTodo}
              tempTodo={tempTodo}
              onUpdateAllTodosStatus={onUpdateAllTodosStatus}
            />

            {todos.length > 0 && (
              <>
                <TodoList
                  todos={visibleTodos}
                  setUpdateTodoStatus={updateTodoStatus}
                  tempTodo={tempTodo}
                  setError={handleError}
                  setDeleteItemFromTodos={deleteItemFromTodos}
                  loading={loading}
                  setLoading={setLoading}
                  onEditTodoTitle={onEditTodoTitle}
                />

                <Footer
                  filterBy={filter}
                  setFilterBy={setFilter}
                  todos={todos}
                  clearAllCompletedTodos={clearAllCompletedTodos}
                />
              </>
            )}
          </div>

          <Error error={error} setError={handleError} />
        </>
      )}
    </div>
  );
};
