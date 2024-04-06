import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  creatTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { SortField } from './types/SortField';
import { filterTodos } from './utils/helpers.ts/filterTodos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/Todolist';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(SortField.All);
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = React.useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const showErrorMessage = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const filteredTodos = filterTodos(todos, filter);
  const handelFilter = (filterValue: SortField) => {
    setFilter(filterValue);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      showErrorMessage('Title should not be empty');

      return;
    }

    setIsDisabled(true);

    try {
      const newTodo = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });
      const newCreatedTodo = await creatTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, newCreatedTodo]);
      setTitle('');
    } catch {
      showErrorMessage('Unable to add a todo');
    } finally {
      setIsDisabled(false);
      setTempTodo(null);
    }
  };

  const updateTodoInList = (prevTodos: Todo[], updatedTodo: Todo): Todo[] => {
    return prevTodos.map(todo =>
      todo.id === updatedTodo.id ? updatedTodo : todo,
    );
  };

  const toggleTodo = async (todoToUpdate: Todo) => {
    setProcessingIds(prevIds => [...prevIds, todoToUpdate.id]);

    try {
      const updatedTodo = await updateTodo({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      });

      setTodos(prevTodos => updateTodoInList(prevTodos, updatedTodo));
    } catch {
      showErrorMessage('Unable to update a todo');
    } finally {
      setProcessingIds(prevIds => prevIds.filter(id => id !== todoToUpdate.id));
    }
  };

  const toggleAll = () => {
    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => toggleTodo(todo));
    } else {
      completedTodos.forEach(todo => toggleTodo(todo));
    }
  };

  const renameTodo = async (todoToRename: Todo, newTitle: string) => {
    setProcessingIds(prevIds => [...prevIds, todoToRename.id]);
    try {
      const updatedTodo = await updateTodo({
        ...todoToRename,
        title: newTitle,
      });

      setTodos(prevTodos => updateTodoInList(prevTodos, updatedTodo));
    } catch (newError) {
      showErrorMessage('Unable to update a todo');
      throw newError;
    } finally {
      setProcessingIds(prevIds => prevIds.filter(id => id !== todoToRename.id));
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setProcessingIds(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      showErrorMessage('Unable to delete a todo');
    } finally {
      setProcessingIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          title={title}
          isDisabled={isDisabled}
          inputRef={inputRef}
          toggleAll={toggleAll}
          todos={todos}
        />

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          toggleTodo={toggleTodo}
          renameTodo={renameTodo}
          processingIds={processingIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            handelFilter={handelFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
