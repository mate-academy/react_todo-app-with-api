/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import {
  USER_ID, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Filter, Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/Error';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<Filter>(Filter.all);
  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filterBy) {
        case Filter.active:
          return !todo.completed;
        case Filter.completed:
          return todo.completed;
        default:
          return true;
      }
    })
  ), [filterBy, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function onDelete(todoId: number) {
    setLoadingTodosIds(current => [...current, todoId]);
    deleteTodo(todoId)
      .then(() => setTodos((current: Todo[]) => current
        .filter(todo => todo.id !== todoId)))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodosIds(current => current.filter(id => id !== todoId));
      });
  }

  function updateTodoData(updatedTodo: Todo) {
    setLoadingTodosIds(current => [...current, updatedTodo.id]);
    updateTodo(updatedTodo)
      .then((newTodo) => setTodos(current => current
        .map(todo => (todo.id === newTodo.id ? newTodo : todo))))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setLoadingTodosIds(current => current
        .filter(todoId => todoId !== updatedTodo.id)));
  }

  function toggleTodoStatus(id: number) {
    const foundTodo = todos.find(todo => todo.id === id);

    if (foundTodo) {
      const updatedTodo = {
        ...foundTodo,
        completed: !foundTodo.completed,
      };

      updateTodoData(updatedTodo);
    } else {
      setErrorMessage('Unable to update a todo');
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          onToggleAll={(id) => toggleTodoStatus(id)}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              selectedTodoId={selectedTodoId}
              setSelectedTodoId={setSelectedTodoId}
              handleDeleteButtonClick={id => onDelete(id)}
              loadingTodosIds={loadingTodosIds}
              toggleTodoStatus={(id) => toggleTodoStatus(id)}
              updateTodoTitle={todo => updateTodoData(todo)}
            />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                selectedTodoId={selectedTodoId}
                setSelectedTodoId={setSelectedTodoId}
                onDelete={id => onDelete(id)}
                loadingTodosIds={loadingTodosIds}
                toggleTodoStatus={(id) => toggleTodoStatus(id)}
                updateTodoTitle={todo => updateTodoData(todo)}
              />
            )}

            <Footer
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              onDelete={id => onDelete(id)}
            />
          </>
        )}
      </div>
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
