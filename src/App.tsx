/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setErrorMessage(Error.LoadTodos);
      }
    })();
  }, []);

  const filteredTodos = useMemo(() => {
    if (filter === Filter.All) {
      return todos;
    }

    return todos.filter(todo => {
      return filter === Filter.Completed ? todo.completed : !todo.completed;
    });
  }, [todos, filter]);

  const todosCompletedCounter: number = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const todosCounter: number = useMemo(() => {
    return todos.length - todosCompletedCounter;
  }, [todos, todosCompletedCounter]);

  const areAllCompletedTodo: boolean = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorMessage(Error.AddTodos);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(Error.DeleteTodos);
      throw err;
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => onDeleteTodo(todo.id));
  };

  const onUpdateTodo = async (todoToUpdate: Todo) => {
    setLoadingIds(prev => [...prev, todoToUpdate.id]);
    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (err) {
      setErrorMessage(Error.UpdateTodos);
      throw err;
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  };

  const onToggleAll = async () => {
    if (todosCounter > 0) {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: true });
      });
    } else {
      todos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: false });
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onAddTodo={onAddTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={!!tempTodo}
          onToggleAll={onToggleAll}
          areAllCompletedTodo={areAllCompletedTodo}
        />

        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              loadingIds={loadingIds}
              onDeleteTodo={onDeleteTodo}
              tempTodo={tempTodo}
              onUpdateTodo={onUpdateTodo}
            />
            <TodoFooter
              filter={filter}
              setFilter={setFilter}
              todosCounter={todosCounter}
              onClearCompleted={onClearCompleted}
              todosCompletedCounter={todosCompletedCounter}
            />
          </>
        )}
      </div>
      <ErrorNotification
        error={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
