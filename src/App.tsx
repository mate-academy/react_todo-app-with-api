import { useEffect, useState, FC } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

import { getFilteredTodosByStatus } from './utils/getFilteredTodosByStatus';

import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Filter } from './types/Filters';
import { todosService } from './api';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);

  const [errorMessage, setErrorMessage] = useState(Errors.DEFAULT);

  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const filteredTodos = getFilteredTodosByStatus(todos, filter);

  const countActiveTodos = todos.reduce((accum, todo) => {
    return !todo.completed ? accum + 1 : accum;
  }, 0);

  const handleGetTodos = () => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.LOADING);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingTodoId(currentIds => [...currentIds, id]);

    todosService
      .deleteTodo(id)
      .then(() => {
        setLoadingTodoId(currentIds =>
          currentIds.filter(currId => currId !== id),
        );

        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== id),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.DELETE_TODO);
        throw error;
      })
      .finally(() => {
        setLoadingTodoId(currentIds =>
          currentIds.filter(currId => currId !== id),
        );
      });
  };

  const handleUpdateTodo = (todoToUpdate: Todo) => {
    setLoadingTodoId(currentIds => [...currentIds, todoToUpdate.id]);

    todosService
      .updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(defTodo =>
            defTodo.id === updatedTodo.id ? updatedTodo : defTodo,
          );
        });

        setEditedTodo(null);
      })
      .catch(error => {
        setErrorMessage(Errors.UPDATE_TODO);
        throw error;
      })
      .finally(() => {
        setLoadingTodoId(currentIds =>
          currentIds.filter(currId => currId !== todoToUpdate.id),
        );
      });
  };

  useEffect(() => {
    handleGetTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
          loadingTodoId={loadingTodoId}
          setLoadingTodoId={setLoadingTodoId}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          onUpdateTodo={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              loadingTodoId={loadingTodoId}
              onDeleteTodo={handleDeleteTodo}
              onUpdateTodo={handleUpdateTodo}
              editedTodo={editedTodo}
              setEditedTodo={setEditedTodo}
            />

            <Footer
              countActiveTodos={countActiveTodos}
              filter={filter}
              setFilter={setFilter}
              todos={todos}
              onDeleteTodo={handleDeleteTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
