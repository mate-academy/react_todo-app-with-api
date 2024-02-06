import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import * as PostServise from './api/todos';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoItem } from './components/TodoItem';

const USER_ID = 35;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null); // Add state for tempTodo
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);

  const closeErrorMsg = useCallback(() => {
    setErrorMessage(ErrorMessage.NONE);
  }, []);

  const newError = useCallback((errorMes: ErrorMessage) => {
    setErrorMessage(errorMes);
    setTimeout(() => {
      closeErrorMsg();
    }, 3000);
  }, [closeErrorMsg]);

  useEffect(() => {
    PostServise.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        newError(ErrorMessage.CANNOT_LOAD_TODOS);
      });
  }, [newError]);

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case FilterType.ACTIVE:
        return !todo.completed;

      case FilterType.COMPLETED:
        return todo.completed;

      case FilterType.ALL:
      default:
        return true;
    }
  });

  const updateTodo = (updatedTodo: Todo) => {
    PostServise.editTodo(updatedTodo)
      .then(() => {
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === updatedTodo.id) {
            return {
              ...todo,
              title: updatedTodo.title, // Update title as well
              completed: updatedTodo.completed,
            };
          }

          return todo;
        }));
      })
      .catch(() => {
        newError(ErrorMessage.UNABLE_TO_UPDATE_A_TODO);
      });
  };

  const isAllCompleted = () => {
    return todos.every(todo => todo.completed === true);
  };

  const handleToggleAllChanged = () => {
    const allCompleted = isAllCompleted();

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    Promise.all(updatedTodos.map(todo => updateTodo(todo)))
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        newError(ErrorMessage.UNABLE_TO_UPDATE_A_TODO);
      });
  };

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      newError(ErrorMessage.TITLE_SHOULD_NOT_BE_EMPTY);

      return;
    }

    setTempTodo({
      id: 0, title, userId: USER_ID, completed: false,
    });

    PostServise.createTodo({ title, userId: USER_ID, completed: false })
      .then((newTodo) => {
        const typedNewTodo = newTodo as Todo;

        setTodos((currentTodos: Todo[]) => [...currentTodos, typedNewTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        newError(ErrorMessage.UNABLE_TO_ADD_A_TODO);
        setTempTodo(null);
      });
  };

  const deleteTodos = (todoId: number) => {
    PostServise.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        newError(ErrorMessage.UNABLE_TO_DELETE_A_TODO);
      });
  };

  const removeCompletedTodos = () => {
    Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo => deleteTodos(todo.id)),
    )
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => !todo.completed)));
  };

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          CreateTodo={addTodo}
          newError={newError}
          todosLength={todos.length}
          isAllCompleted={isAllCompleted}
          handleToggleAllChanged={handleToggleAllChanged}
        />
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos}
            deleteTodo={deleteTodos}
            updateTodo={updateTodo}
          />
          {tempTodo && (
            <TodoItem
              key={tempTodo?.id}
              todo={tempTodo}
              deleteTodo={deleteTodos}
              isTemp={!tempTodo}
              updateTodo={updateTodo}
            />
          )}
          {/* Display loader for tempTodo */}
          {tempTodo && (
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            itemsLeft={itemsLeft}
            removeCompleted={removeCompletedTodos}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification errorMessage={errorMessage} close={closeErrorMsg} />
    </div>
  );
};
