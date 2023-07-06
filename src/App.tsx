import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  addTodo, changeTodo, deleteTodo, getTodos,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Filters } from './types/Filter';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';
import { UpdateTodoArgs } from './types/UpdateTodoArgs';
import { filterTodos } from './utils/filterTodos';

const USER_ID = 10908;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState(Filters.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const removeError = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer: Todo[]) => {
        setTodos(todosFromServer);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setTimeout(removeError, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const createTodo = async (title: string) => {
    try {
      if (title.trim() === '') {
        setErrorMessage('Todo title cannot be empty');

        return;
      }

      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const createdTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const updateTodo = async (todoId: number, args: UpdateTodoArgs) => {
    try {
      const updatedTodo = await changeTodo(todoId, args);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      setErrorMessage('Unable to update the todo');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createTodo(todoTitle);
    setTodoTitle('');
  };

  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => (
    setTodoTitle(event.target.value)
  );

  const handleClearCompleted = () => {
    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  };

  const handleToggleAllTodos = () => {
    let toggledTodos = todos;

    if (uncompletedTodos.length) {
      toggledTodos = todos.filter(todo => !todo.completed);
    }

    toggledTodos.forEach(todo => updateTodo(todo.id,
      { completed: !todo.completed }));
  };

  const filteredTodos = filterTodos(
    todos,
    filter,
    uncompletedTodos,
    completedTodos,
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleSubmit={handleSubmit}
          handleTodoTitle={handleTodoTitle}
          uncompletedTodos={uncompletedTodos}
          tempTodo={tempTodo}
          todoTitle={todoTitle}
          handleToggleAllTodos={handleToggleAllTodos}
        />

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
          updateTodo={updateTodo}
        />

        {todos.length !== 0
        && (
          <TodoFooter
            completedTodos={completedTodos}
            uncompletedTodos={uncompletedTodos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <TodoError
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
