import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import {
  TodoNotification,
} from './components/TodoNotification/TodoNotification';
import { FilterType } from './types/FilterType';

const USER_ID = 10594;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingTodos, setRemainingTodos] = useState(0);
  const [areAllTodosCompleted, setAreAllTodosCompleted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isCreatingTodo, setIsCreatingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [updateQueue, setUpdateQueue]
  = useState<{ id: number, completed: boolean }[]>([]);

  const handleCompletedTodosChange = (isChecked: boolean, id: number) => {
    setUpdateQueue([...updateQueue, { id, completed: isChecked }]);
  };

  useEffect(() => {
    const processUpdates = async () => {
      if (updateQueue.length > 0) {
        const newUpdatingIds = updateQueue.map(update => update.id);

        setUpdatingIds([...updatingIds, ...newUpdatingIds]);

        try {
          await Promise.all(updateQueue.map(async ({ id, completed }) => {
            await updateTodo(id, { completed });

            setTodos(prevTodos => {
              const newTodos = prevTodos.map(todo => {
                if (todo.id === id) {
                  return { ...todo, completed };
                }

                return todo;
              });

              setRemainingTodos(newTodos
                .filter(todo => !todo.completed).length);

              return newTodos;
            });

            setUpdatingIds(prevUpdatingIds => prevUpdatingIds
              .filter(uid => uid !== id));
          }));
        } catch (error) {
          setErrorMessage('Unable to update todos');
        } finally {
          setUpdateQueue(updateQueue.slice(updateQueue.length));
        }
      }
    };

    processUpdates();
  }, [updateQueue]);

  const handleToggleAllTodos = async () => {
    const todoIds = todos.map(todo => todo.id);

    setUpdatingIds([...updatingIds, ...todoIds]);

    try {
      await Promise.all(todos.map(
        todo => updateTodo(todo.id, { completed: !areAllTodosCompleted }),
      ));

      const newTodos = todos.map(todo => (
        { ...todo, completed: !areAllTodosCompleted }
      ));

      setTodos(newTodos);
      setRemainingTodos(newTodos.filter(todo => !todo.completed).length);
    } catch (error) {
      setErrorMessage('Unable to update todos');
    } finally {
      setUpdatingIds([]);
    }
  };

  useEffect(() => {
    setAreAllTodosCompleted(todos.every(todo => todo.completed));
  }, [todos]);

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const todoIds = completedTodos.map(todo => todo.id);

    setUpdatingIds([...updatingIds, ...todoIds]);

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));

      setTodos(todos.filter(todo => !todo.completed));
    } catch (error) {
      setErrorMessage('Unable to delete a completed todos');
    } finally {
      setUpdatingIds([]);
    }
  };

  const handleAddTodo = async (title: string) => {
    if (title.trim().length === 0) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsCreatingTodo(true);

    try {
      const newTodo: Todo = await createTodo(title, USER_ID);

      setTodos([...todos, newTodo]);
      setRemainingTodos(remainingTodos + 1);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setIsCreatingTodo(false);
      setTempTodo(null);
    }
  };

  const handleRemoveTodo = async (id: number, completed: boolean) => {
    setUpdatingIds([...updatingIds, id]);

    try {
      await deleteTodo(id);

      setTodos(todos.filter(todo => todo.id !== id));
      if (!completed) {
        setRemainingTodos(remainingTodos - 1);
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setUpdatingIds([]);
    }
  };

  const handleUpdateTodo = async (id: number, title: string) => {
    setUpdatingIds([...updatingIds, id]);

    try {
      await updateTodo(id, { title });

      setTodos(todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, title };
        }

        return todo;
      }));
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingIds([]);
    }
  };

  const handleDismissNotification = () => {
    setErrorMessage('');
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.ACTIVE:
        return !todo.completed;
      case FilterType.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
        setRemainingTodos(loadedTodos.filter(todo => !todo.completed).length);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader
          onToggleAll={handleToggleAllTodos}
          active={areAllTodosCompleted}
          onAddTodo={handleAddTodo}
          isCreatingTodo={isCreatingTodo}
          todosLength={todos.length}
        />

        <TodoList
          todos={filteredTodos}
          onChange={handleCompletedTodosChange}
          onRemove={handleRemoveTodo}
          onUpdate={handleUpdateTodo}
          tempTodo={tempTodo}
          updatingIds={updatingIds}
        />

        {todos.length > 0 && (
          <TodoFooter
            remainingTodos={remainingTodos}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={todos.some(todo => todo.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}

        {errorMessage && (
          <TodoNotification
            message={errorMessage}
            onDismiss={handleDismissNotification}
          />
        )}

      </div>
    </div>
  );
};
