/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from './components/Loader';
import { TodoFilter } from './components/TodoFilter';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { StatusToFilterBy, Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';

const USER_ID = 6999;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    title: '',
    completed: false,
    userId: 0,
  });
  const [filterBy, setFilterBy] = useState(StatusToFilterBy.All);
  const [isAdding, setIsAdding] = useState(false);
  // const [coveredTodo, setCoveredTodo] = useState(false);

  const itemsLeft = todos.filter(todo => todo.completed === false);

  const getTodosFromServer = async () => {
    setIsLoading(true);
    setError('');

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError('Server error!');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = (title: string) => {
    setIsAdding(true);
    if (!title.trim().length) {
      setError("Title can't be empty");
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo(newTodo);
      setError('');

      postTodo(USER_ID, newTodo)
        .then((todo: Todo) => {
          setTodos((prevTodos) => {
            return [...prevTodos, todo];
          });
        })
        .catch(() => {
          setError('Unable to add a todo!');
          setTimeout(() => {
            setError('');
          }, 3000);
        })
        .finally(() => {
          setIsAdding(false);
        });
    }
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  const deleteCompleteTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
    setTodos(todos.filter((todo) => !todo.completed));
  }, [todos]);

  const handleUpdateTodo = async (todoId: number, todoData: Partial<Todo>) => {
    try {
      const updatedTodo = await updateTodo(todoId, todoData);

      setTodos((todo) => todo.map((prevTodo) => {
        if (prevTodo.id === updatedTodo.id) {
          return {
            ...prevTodo,
            ...updatedTodo,
          };
        }

        return prevTodo;
      }));
    } catch {
      setError('Unable to update a todo!');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(({ completed }) => completed === true);

    if (areAllCompleted) {
      todos.forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: false });
      });
    } else {
      todos.forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: true });
      });
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const visibleTodos = todos.filter((todo) => {
    let isStatusCorrect = true;

    switch (filterBy) {
      case StatusToFilterBy.Active:
        isStatusCorrect = !todo.completed;
        break;

      case StatusToFilterBy.Completed:
        isStatusCorrect = todo.completed;
        break;

      default:
        break;
    }

    return isStatusCorrect;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoInput
          itemsCompleted={itemsLeft}
          addTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
        />

        <section className="todoapp__main">
          {isLoading ? (
            <Loader />
          ) : (
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              tempTodo={tempTodo}
              deleteTodo={handleDeleteTodo}
              onUpdateTodo={handleUpdateTodo}
            />
          )}
        </section>

        {todos.length > 0 && (
          <TodoFilter
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            itemsLeft={itemsLeft.length}
            todos={todos}
            deleteComplete={deleteCompleteTodos}
          />
        )}

      </div>

      {error && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setError('')}
          />
          {error}
        </div>
      )}

    </div>
  );
};
