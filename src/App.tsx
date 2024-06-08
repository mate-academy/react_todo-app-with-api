import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import * as todoMethods from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [title, setTitle] = useState('');
  const [loadingId, setLoadingId] = useState<number[]>([]);

  const fetchData = () => {
    todoMethods
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  };

  useEffect(() => {
    fetchData();
  }, []);

  function getFilteredTodos(newTodos: Todo[], newFilter: Filter) {
    switch (newFilter) {
      case Filter.Active:
        return newTodos.filter(todo => !todo.completed);
      case Filter.Completed:
        return newTodos.filter(todo => todo.completed);
      default:
        return newTodos;
    }
  }

  const filteredTodos = getFilteredTodos(todos, filter);
  const activeTodos = todos.filter(todo => !todo.completed);
  const complitedTodos = todos.filter(todo => todo.completed);

  const addTodo = (input: string) => {
    setLoadingId(currentId => [...currentId, 0]);
    setTempTodo({
      userId: todoMethods.USER_ID,
      title: input,
      id: 0,
      completed: false,
    });

    todoMethods
      .createTodo({
        userId: todoMethods.USER_ID,
        title: input,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setLoadingId(currentId => currentId.filter(id => id !== 0));
        setTempTodo(null);
      });
  };

  const deleteAllCompleted = async () => {
    complitedTodos.forEach(todo => {
      setLoadingId(currentId => [...currentId, todo.id]);
      todoMethods
        .deleteTodo(todo.id)
        .then(() => setTodos([...todos.filter(item => !item.completed)]))
        .finally(() => {
          setLoadingId(currentId => currentId.filter(id => id !== todo.id));
        });
    });
  };

  const toggleTodo = (todoToUpdate: Todo) => {
    setLoadingId(currentId => [...currentId, todoToUpdate.id]);
    todoMethods
      .updateTodo({ ...todoToUpdate, completed: !todoToUpdate.completed })
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        setLoadingId(currentId =>
          currentId.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  const toggleAllTodo = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(todo => toggleTodo(todo));
    } else {
      complitedTodos.forEach(todo => toggleTodo(todo));
    }
  };

  const renameTodo = (editedTitle: string, todoToUpdate: Todo) => {
    setLoadingId(currentId => [...currentId, todoToUpdate.id]);
    todoMethods
      .updateTodo({ ...todoToUpdate, title: editedTitle })
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        setLoadingId(currentId =>
          currentId.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          todos={todos}
          setTempTodo={setTempTodo}
          title={title}
          setTitle={setTitle}
          toggleAllTodo={toggleAllTodo}
          isDisabled={loadingId.length > 0}
        />

        <TodoList
          todos={filteredTodos}
          setErrorMessage={setErrorMessage}
          toggleTodo={toggleTodo}
          renameTodo={renameTodo}
          loadingId={loadingId}
          setTodos={setTodos}
          allTodos={todos}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            setErrorMessage={setErrorMessage}
            isTempt={true}
            toggleTodo={toggleTodo}
            renameTodo={renameTodo}
            loadingId={loadingId}
            setTodos={setTodos}
            todos={todos}
          />
        )}

        {!!todos.length && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            todos={todos}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      <Error error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
