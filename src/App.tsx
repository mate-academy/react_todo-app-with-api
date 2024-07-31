import React, { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import * as todosServices from './api/todos';
import { Filters } from './types/Filters';
import { UserWarning } from './UserWarning';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 11689;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(Filters.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const showErrorMessage = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (USER_ID) {
      todosServices
        .getTodos(USER_ID)
        .then(setTodos)
        .catch(() => showErrorMessage(ErrorMessage.loadTodo));
    }
  }, []);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const addTodos = (newTodo: Todo) => {
    setProcessingIds(prevIds => [...prevIds, newTodo.id]);

    return todosServices
      .addTodo(newTodo)
      .then(newTodos => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodos];
        });
      })
      .finally(() => setProcessingIds([]));
  };

  const deleteTodo = (todoId: number) => {
    showErrorMessage('');
    setProcessingIds(prevIds => [...prevIds, todoId]);

    todosServices
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        showErrorMessage(ErrorMessage.deleteTodo);
      })
      .finally(() => {
        setProcessingIds(prevIds => prevIds.filter(id => id !== todoId));
      });
  };

  const deleteCompletedTodos = () => {
    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  const updateStatusTodo = (todoToUpdate: Todo) => {
    setErrorMessage('');
    setProcessingIds(prevIds => [...prevIds, todoToUpdate.id]);

    todosServices
      .updateTodo({
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
      .catch(() => showErrorMessage(ErrorMessage.updateTodo))
      .finally(() => {
        setProcessingIds(prevIds =>
          prevIds.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  const updateStatusAllTodo = () => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => updateStatusTodo(todo));
    } else {
      completedTodos.forEach(todo => updateStatusTodo(todo));
    }
  };

  const renameTodo = (todoToRename: Todo) => {
    showErrorMessage('');
    setProcessingIds(prevIds => [...prevIds, todoToRename.id]);

    return todosServices
      .updateTodo(todoToRename)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        showErrorMessage(ErrorMessage.updateTodo);

        throw error;
      })
      .finally(() => setProcessingIds([]));
  };

  const visibleTodos = (() => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  })();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          activeTodos={activeTodos}
          updateStatusAllTodo={updateStatusAllTodo}
          onSubmit={addTodos}
          userId={USER_ID}
          onError={showErrorMessage}
          onSubmitTempTodo={setTempTodo}
          processingIds={processingIds}
        />

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

        {!!todos.length && (
          <Footer
            filter={filter}
            onFilter={setFilter}
            todos={todos}
            onDeleteAllComleted={deleteCompletedTodos}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} onError={setErrorMessage} />
    </div>
  );
};
