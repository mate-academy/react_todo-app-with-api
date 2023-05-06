/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMesage/ErrorMesage';
import { FilterType } from './types/FilterType';
import { USER_ID } from './utils/fetchClient';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [
    currentFilter,
    setCurrentFilter,
  ] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingTodo, setIsLoadingTodo] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setErrorMessage('Unable to update a todo');
      }
    };

    fetchTodos();
  }, []);

  const addNewTodo = (title: string) => {
    if (!title) {
      setErrorMessage("Title can't be empty");

      return;
    }

    const newTempTodo = {
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
    };

    setTempTodo(newTempTodo);
    setIsLoadingTodo(true);

    addTodo(USER_ID, newTempTodo)
      .then((todo: Todo[]) => {
        setTodos((prevTodos) => {
          return prevTodos.concat(todo);
        });
        setTempTodo(null);
        setIsLoadingTodo(false);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo!');
        setTempTodo(null);
        setIsLoadingTodo(false);
      });
  };

  const removeTodo = (id: number) => {
    setIsLoadingTodo(true);
    deleteTodo(id)
      .then(() => {
        const newTodosList = todos.filter(todo => todo.id !== id);

        setTodos(newTodosList);
        setIsLoadingTodo(false);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setIsLoadingTodo(false);
      });
  };

  const handleUpdateTodo = (todo: Todo) => {
    updateTodo(todo.id, { completed: !todo.completed })
      .then((updatedTodo: Todo) => {
        setTodos(currentTodos => {
          const todoIndex = todos
            .findIndex(currTodo => currTodo.id === updatedTodo.id);

          if (todoIndex > -1) {
            return [
              ...todos.slice(0, todoIndex),
              updatedTodo,
              ...todos.slice(todoIndex + 1),
            ];
          }

          return currentTodos;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      });
  };

  const handleUpdateAllTodos = (completed: boolean) => {
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !completed,
    }));

    Promise.all(updatedTodos.map((todo) => updateTodo(todo.id,
      {
        completed: !completed,
      })))
      .then((updatedCurrTodos: Todo[]) => {
        setTodos(updatedCurrTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to update todos');
      });
  };

  const filteredTodos: Todo[] = useMemo(() => {
    return todos.filter((todo) => {
      switch (currentFilter) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, currentFilter]);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodos={activeTodos}
          setTodoTitle={setTodoTitle}
          todoTitle={todoTitle}
          addNewTodo={addNewTodo}
          onUpdateAllTodos={handleUpdateAllTodos}
        />

        <TodoMain
          filteredTodos={filteredTodos}
          removeTodo={removeTodo}
          handleUpdateTodo={handleUpdateTodo}
          isLoadingTodo={isLoadingTodo}
          tempTodo={tempTodo}
          todos={todos}
          setTodos={setTodos}
        />

        {todos.length > 0
          && (
            <TodoFooter
              todos={todos}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              completedTodos={completedTodos}
            />
          )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
