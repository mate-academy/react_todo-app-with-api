/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import {
  getTodos, deleteTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { filterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterField, setFilterField] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeTodosCounter = todos.filter(todo => !todo.completed).length;
  const completedTodosCounter = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterField);
  }, [todos, filterField]);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setErrorMessage('');
      setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todoId]);

      await deleteTodo(todoId);

      setTodos((prevState) => (
        prevState.filter(todo => todo.id !== todoId)
      ));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      setProcessingTodoIds(
        (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
      );
    }
  }, []);

  const handleToggleTodo = async (todo: Todo) => {
    try {
      setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);

      const updatedTodo = await updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prevState => prevState
        .map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    } finally {
      setProcessingTodoIds(
        (prevTodoIds) => prevTodoIds.filter((id) => id !== todo.id),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          onTodosChange={setTodos}
          handleToggleTodo={handleToggleTodo}
          activeTodosCounter={activeTodosCounter}
          completedTodosCounter={completedTodosCounter}
          onTempTodoChange={setTempTodo}
          onErrorMessageChange={setErrorMessage}
        />

        <TodoList
          filteredTodos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          processingTodoIds={processingTodoIds}
          handleToggleTodo={handleToggleTodo}
          tempTodo={tempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setProcessingTodoIds={setProcessingTodoIds}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            activeTodosCounter={activeTodosCounter}
            completedTodosCounter={completedTodosCounter}
            onFilterFieldChange={setFilterField}
            filterField={filterField}
            handleDeleteTodo={handleDeleteTodo}
            onErrorMessageChange={setErrorMessage}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onErrorMessageChange={setErrorMessage}
      />
    </div>
  );
};
