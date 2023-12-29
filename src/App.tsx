import React, { useEffect, useState } from 'react';

import { Todo } from './types/Todo';
import { deleteTodos, getTodos, updateTodos } from './api/todos';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';
import { FilterParams } from './types/FilteredParams';
import { UpdatingData } from './types/UpdatingData';
import { USER_ID } from './services/DefaultTodo';

function filterBy(todos: Todo[], filterValue: string) {
  let filteredTodos = todos;

  switch (filterValue) {
    case FilterParams.ACTIVE:
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
      break;

    case FilterParams.COMPLETED:
      filteredTodos = filteredTodos.filter(todo => todo.completed);
      break;

    case FilterParams.All:
    default:
      return filteredTodos;
  }

  return filteredTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState(FilterParams.All);
  const [isDisableInput, setIsDisableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<number[]>([]);
  const [
    isCompletedTodos, setIsCompletedTodos,
  ] = useState(() => {
    return todos.length
      ? todos.every(todo => todo.completed)
      : false;
  });

  const makeToggleButtonActive = (currentTodos: Todo[]) => {
    setIsCompletedTodos(currentTodos.every(todo => todo.completed));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(todo => setTodos(todo))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    makeToggleButtonActive(todos);
  }, [todos]);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);

    if (message) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const onUpdate = (
    { todo, key, value }: UpdatingData,
    setIsActiveInput: (value: boolean) => void,
  ) => {
    setSelectedTodoId([todo.id]);
    makeToggleButtonActive(todos);

    updateTodos({ ...todo, [key]: value })
      .then(data => {
        setTodos(currentTodos => currentTodos
          .map(todoMap => (todoMap.id === todo.id ? data : todoMap)));
        setIsActiveInput(false);
      })
      .catch((error) => {
        showErrorMessage('Unable to update a todo');
        if (key === 'completed') {
          setIsActiveInput(false);
        } else {
          setIsActiveInput(true);
        }

        throw error;
      })
      .finally(() => {
        setSelectedTodoId([]);
      });
  };

  const onDelete = (todoId: number) => {
    setIsDisableInput(true);
    setSelectedTodoId([todoId]);

    deleteTodos(todoId)
      .then(() => setTodos((currentTodos) => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch().catch((error) => {
        showErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setIsDisableInput(false);
        setSelectedTodoId([]);
      });
  };

  const makeAllTodosCompleted = () => {
    const isCompleted = todos.every(todo => todo.completed);
    const activeTodos = isCompleted
      ? todos.filter(todo => todo.completed)
      : todos.filter(todo => !todo.completed);

    setSelectedTodoId(activeTodos.map(todoMap => todoMap.id));

    todos.forEach(todo => {
      updateTodos({ ...todo, completed: !isCompleted })
        .then(data => {
          setIsDisableInput(true);
          setTodos(curentTodos => curentTodos
            .map(todoMap => (todoMap.id === data.id ? data : todoMap)));
        })
        .catch((error) => {
          showErrorMessage('Unable to update a todo');
          throw error;
        })
        .finally(() => {
          makeToggleButtonActive(todos);
          setIsDisableInput(false);
          setSelectedTodoId([]);
        });
    });
  };

  const removeCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsDisableInput(true);
    setSelectedTodoId(completedTodos.map(todo => todo.id));

    completedTodos.forEach(todo => {
      deleteTodos(todo.id)
        .then(() => setTodos(current => current.filter(t => t.id !== todo.id)))
        .catch((error) => {
          showErrorMessage('Unable to delete a todo');
          throw error;
        })
        .finally(() => {
          setIsDisableInput(false);
          setSelectedTodoId([]);
        });
    });
  };

  const visibleTodos = filterBy([...todos], filterValue);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          isDisableInput={isDisableInput}
          setIsDisableInput={setIsDisableInput}
          setTempTodo={setTempTodo}
          isCompletedTodos={isCompletedTodos}
          makeAllTodosCompleted={makeAllTodosCompleted}
          showErrorMessage={showErrorMessage}
        />

        <TodoList
          todos={visibleTodos}
          isDisableInput={isDisableInput}
          tempTodo={tempTodo}
          selectedTodoId={selectedTodoId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            removeCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
