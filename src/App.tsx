/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';

import {
  Todo,
  TodoRequest,
  TodoStatus,
  TodoTitle,
} from './types/Todo';
import { FilteredBy } from './types/FilteredBy';
import {
  getTodos,
  addTodo,
  deleteTodo,
  patchTodoStatus,
  patchTodoTitle,
} from './api/todos';
import { Footer } from './Footer';
import { TodoList } from './TodoList';
import { Header } from './Header';
import { Notifications } from './Notification';

const USER_ID = 6459;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [todoStatus, setTodoStatus] = useState<FilteredBy>(FilteredBy.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const todosToShow = useMemo(() => {
    return todos.filter((todo) => {
      switch (todoStatus) {
        case FilteredBy.ALL:
          return true;

        case FilteredBy.ACTIVE:
          return !todo.completed;

        case FilteredBy.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, todoStatus]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer: React.SetStateAction<Todo[]>) => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to upload a todo');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = async () => {
    if (query.length && query.trim() !== '') {
      const newTodo: TodoRequest = {
        userId: USER_ID,
        title: query,
        completed: false,
      };

      setQuery('');
      setTempTodo({ id: 0, ...newTodo });
      await addTodo(newTodo)
        .then((newTodoFromServer: Todo) => {
          setTodos((prevTodos) => [...prevTodos, newTodoFromServer]);
          setTempTodo(null);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTempTodo(null);
        });
    } else {
      setErrorMessage("Title can't be empty");
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodos((prevState) => [...prevState, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodos(prevState => prevState.filter(id => id !== todoId));
    }
  };

  const handleDeleteCompletedTodos = () => {
    const completedTodos = todosToShow.filter((todo) => todo.completed);

    completedTodos.forEach(async (completedTodo) => {
      setLoadingTodos((prevState) => [...prevState, completedTodo.id]);
      try {
        await deleteTodo(completedTodo.id);
        setTodos((prevTodos) => prevTodos.filter((prevTodo) => prevTodo.id !== completedTodo.id));
      } catch {
        setErrorMessage('Unable to clear completed todos');
      } finally {
        setLoadingTodos(prevState => prevState.filter(id => id !== completedTodo.id));
      }
    });
  };

  const handleSingleTodoUpdate = async (selectedTodo: Todo) => {
    const updatedStatusToServer: TodoStatus = {
      completed: !selectedTodo.completed,
    };

    const updateState = () => {
      return todos.map((todoToChange) => {
        return todoToChange.id === selectedTodo.id
          ? { ...todoToChange, completed: updatedStatusToServer.completed }
          : todoToChange;
      });
    };

    setLoadingTodos((prevState) => [...prevState, selectedTodo.id]);
    try {
      await patchTodoStatus(selectedTodo.id, updatedStatusToServer);
      setTodos(updateState());
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodos(prevState => prevState.filter(id => id !== selectedTodo.id));
    }
  };

  const handleAllTodosUpdate = async (todosFromServer: Todo[]) => {
    const areAllCompleted = todosFromServer.every((todo) => todo.completed);

    try {
      const updatedTodos = await Promise.all(todosFromServer.map(async (todo) => {
        if (todo.completed === areAllCompleted) {
          setLoadingTodos((prevState) => [...prevState, todo.id]);
          await patchTodoStatus(todo.id, { completed: !areAllCompleted });
          setLoadingTodos(prevState => prevState.filter(id => id !== todo.id));
        }

        return { ...todo, completed: !areAllCompleted };
      }));

      setTodos(updatedTodos);
    } catch {
      setErrorMessage('Unable to update all todos');
      setLoadingTodos([]);
    }
  };

  const handleTitleChangesSubmit = async (
    selectedTodo: Todo,
    updatedTodoTitle: string,
  ) => {
    const updatedTitleToServer: TodoTitle = { title: updatedTodoTitle };

    const updateState = () => {
      return todos.map((todoToChange) => {
        return todoToChange.id === selectedTodo.id
          ? { ...todoToChange, ...updatedTitleToServer }
          : todoToChange;
      });
    };

    if (selectedTodo.title !== updatedTodoTitle) {
      setLoadingTodos((prevState) => [...prevState, selectedTodo.id]);
      await patchTodoTitle(selectedTodo.id, updatedTitleToServer);
      try {
        setTodos(updateState());
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setLoadingTodos(prevState => prevState.filter(id => id !== selectedTodo.id));
      }
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onAdd={handleAddTodo}
          onALLStatusChange={handleAllTodosUpdate}
          tempTodo={tempTodo}
          query={query}
          setQuery={setQuery}
          todos={todos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todosToShow={todosToShow}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              onStatusChange={handleSingleTodoUpdate}
              onTitleChange={handleTitleChangesSubmit}
              loadingTodos={loadingTodos}
            />
            <Footer
              onDeleteCompleted={handleDeleteCompletedTodos}
              todosToShow={todosToShow}
              todoStatus={todoStatus}
              setTodoStatus={setTodoStatus}
              todos={todos}
            />
          </>
        )}
      </div>
      <Notifications errorMessage={errorMessage} />
    </div>
  );
};
