/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {
  createTodo, getTodo, getTodos, refreshTodo, removeTodo,
} from './api/todos';
import { TodoError } from './components/TodoError';
import { Status, ToDoFooter } from './components/TodoFooter';
import { Header } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 7096;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todosStatus, setTodosStatus] = useState<Status>(Status.All);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(true);
        setErrorMsg(ErrorMessage.onLoad);

        setTimeout(() => {
          setError(false);
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (todo) {
      getTodo(todo.id)
        .then(setTodo);
    }
  }, [todo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (todoData: Omit<Todo, 'id'>) => {
    if (todoData.title) {
      createTodo(todoData)
        .then(newTodo => setTodos([...todos, newTodo]))
        .catch(() => setErrorMsg(ErrorMessage.OnAdd));
    } else {
      setError(true);
      setErrorMsg(ErrorMessage.onEmpty);
      setTimeout(() => {
        setError(false);
        setErrorMsg('');
      }, 3000);
    }
  };

  const deleteTodo = (todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todoToDelete => todoToDelete.id !== todoId));
      })
      .catch(() => setErrorMsg(ErrorMessage.onDelete));
  };

  const updateTodo = (todoToUpdate: Todo) => {
    setUpdatingTodos(curr => [...curr, todoToUpdate.id]);

    refreshTodo(todoToUpdate)
      .then(() => {
        setTodos(
          todos.map(currentTodo => {
            if (currentTodo.id === todoToUpdate.id) {
              return todoToUpdate;
            }

            return currentTodo;
          }),
        );
      })
      .catch(() => setErrorMsg(ErrorMessage.onUpdate))
      .finally(() => {
        setUpdatingTodos(curr => curr.filter(id => id !== todoToUpdate.id));
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo({
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    });

    setNewTodoTitle('');
  };

  let visibleTodos = todos;

  if (todosStatus === Status.Active) {
    visibleTodos = todos.filter(todo => !todo.completed);
  }

  if (todosStatus === Status.Completed) {
    visibleTodos = todos.filter(todo => todo.completed);
  }

  const completedTodos = visibleTodos.filter(td => td.completed);

  const clearCompleted = () => {
    completedTodos.forEach(td => {
      deleteTodo(td.id);
    });
    setTodos(current => current.filter(todo => !todo.completed));
  };

  const hasUncompletedTodo = todos.some(todo => !todo.completed);
  const hasAllTodosCompleted = todos.every(todo => todo.completed);

  const toggleCompleteAllTodos = () => {
    if (hasUncompletedTodo) {
      todos.forEach(todo => {
        if (!todo.completed) {
          updateTodo({
            ...todo,
            completed: true,
          });
        }
      });
    }

    if (hasAllTodosCompleted) {
      todos.forEach(todo => {
        updateTodo({
          ...todo,
          completed: false,
        });
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          hasUncompletedTodo={hasAllTodosCompleted}
          toggleCompleteAllTodos={toggleCompleteAllTodos}
        />

        <TodoMain
          todos={visibleTodos}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          updatingTodos={updatingTodos}
        />
        {todos.length > 0 && (
          <ToDoFooter
            onClearCompleted={clearCompleted}
            todos={todos}
            todosStatus={todosStatus}
            setTodosStatus={setTodosStatus}
          />
        )}
      </div>

      {error && (
        <TodoError
          error={error}
          errorMsg={errorMsg}
          setError={setError}
        />
      )}
    </div>
  );
};
