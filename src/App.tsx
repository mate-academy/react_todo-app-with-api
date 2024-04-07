import React, { useEffect, useState } from 'react';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { NewTodoForm } from './components/FormTodo';
import { TodoList } from './components/TodoList';
import classNames from 'classnames';
import { getfilteredTodos } from './utils/getFilterTodos';
import { FILTERS } from './types/Filters';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [filter, setFilter] = useState(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  function showErrorMessage(error: string) {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    if (todosService.USER_ID) {
      todosService
        .getTodos()
        .then(setTodos)
        .catch(() => showErrorMessage('Unable to load todos'));
    }
  }, []);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  function addTodos(newTodo: Todo) {
    setProcessingIds(prevIds => [...prevIds, newTodo.id]);

    return todosService
      .createTodos(newTodo)
      .then(newTodos => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodos];
        });
      })
      .finally(() => setProcessingIds([]));
  }

  function deleteTodo(todoId: number) {
    showErrorMessage('');
    setProcessingIds(prevIds => [...prevIds, todoId]);

    todosService
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(prevIds => prevIds.filter(id => id !== todoId));
      });
  }

  function deleteCompletedTodos() {
    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  }

  function updateStatusTodo(todoToUpdate: Todo) {
    setErrorMessage('');
    setProcessingIds(prevIds => [...prevIds, todoToUpdate.id]);

    todosService
      .upDateTodos({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => showErrorMessage('Unable to update a todo'))
      .finally(() => {
        setProcessingIds(prevIds =>
          prevIds.filter(id => id !== todoToUpdate.id),
        );
      });
  }

  function updateStatusAllTodo() {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => updateStatusTodo(todo));
    } else {
      completedTodos.forEach(todo => updateStatusTodo(todo));
    }
  }

  function renameTodo(updatedTodo: Todo) {
    setProcessingIds(prevIds => [...prevIds, updatedTodo.id]);

    return todosService
      .upDateTodos(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(tod => tod.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(error => {
        showErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => setProcessingIds([]));
  }

  const visibleTodos = getfilteredTodos(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: activeTodos.length === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={updateStatusAllTodo}
            />
          )}

          <NewTodoForm
            onSubmit={addTodos}
            userId={todosService.USER_ID}
            onError={showErrorMessage}
            onSubmitTempTodo={setTempTodo}
            processingIds={processingIds}
          />
        </header>
        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onToggle={updateStatusTodo}
            onRename={renameTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            filter={filter}
            onFilter={setFilter}
            todos={todos}
            onDeleteAllComleted={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onError={setErrorMessage}
      />
    </div>
  );
};
