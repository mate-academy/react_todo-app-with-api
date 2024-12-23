/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useState, useMemo } from 'react';
import { Todo } from './types/Todo';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { ErrorStatus } from './types/ErrorStatus';
import { Status } from './types/Status';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorStatus>(ErrorStatus.Empty);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodoList)
      .catch(() => {
        setError(ErrorStatus.UnableToLoad);
      });
  }, []);

  const todosActiveNum = useMemo(
    () => todoList.filter(todo => !todo.completed).length,
    [todoList],
  );

  const todosCompletedNum = useMemo(
    () => todoList.filter(todo => todo.completed).length,
    [todoList],
  );

  const allTodosCompleted = useMemo(
    () => todoList.length === todosCompletedNum,
    [todoList],
  );

  const handleAddTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodoList(prev => [...prev, newTodo]);
    } catch (err) {
      setError(ErrorStatus.UnableToAdd);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const handleRemoveTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodoList(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setError(ErrorStatus.UnableToDelete);
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todoList.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleRemoveTodo(todo.id);
    });
  };

  const handleUpdatedTodo = async (todoToUpdate: Todo): Promise<void> => {
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);
    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodoList(prev =>
        prev.map(todoElem =>
          todoElem.id === updatedTodo.id ? todoToUpdate : todoElem,
        ),
      );
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      setError(ErrorStatus.UnableToUpdate);
      throw error;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  };

  const handleToggleAll = async () => {
    if (todosActiveNum > 0) {
      const activeTodos = todoList.filter(todo => !todo.completed);

      activeTodos.forEach(todo => {
        handleUpdatedTodo({ ...todo, completed: true });
      });
    } else {
      todoList.forEach(todo => {
        handleUpdatedTodo({ ...todo, completed: false });
      });
    }
  };

  const filteredTodoList = (): Todo[] => {
    switch (filter) {
      case Status.Active:
        return todoList.filter(todo => !todo.completed);
      case Status.Completed:
        return todoList.filter(todo => todo.completed);
      default:
        return todoList;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          setErrorMessage={setError}
          todoLength={todoList.length}
          todoList={todoList}
          onToggleAll={handleToggleAll}
          allTodosCompleted={allTodosCompleted}
        />

        {(!!todoList.length || tempTodo) && (
          <>
            <TodoList
              filteredTodoList={filteredTodoList()}
              loadingTodoIds={loadingTodoIds}
              tempTodo={tempTodo}
              handleRemoveTodo={handleRemoveTodo}
              handleUpdatedTodo={handleUpdatedTodo}
            />

            <Footer
              todosCounter={todosActiveNum}
              filterStatus={filter}
              setFilter={setFilter}
              onClearCompleted={handleClearCompleted}
              showClearCompletedButton={todoList.some(todo => todo.completed)}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
