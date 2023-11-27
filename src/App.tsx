import React, { useEffect, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { Error } from './types/Error';

const USER_ID = 11909;

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isDisable, setIsDisable] = useState(false);
  const [updatingTodo, setUpdatingTodo] = useState<Todo | undefined>(undefined);
  const [deletingTodo, setDeletingTodo] = useState<Todo | undefined>(undefined);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.LoadTodos);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const addTodo = (title: string) => {
    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setIsDisable(true);
    setErrorMessage('');
    setTempTodo({ id: 0, ...newTodo });

    todoService.createTodo(newTodo)
      .then(newPost => {
        setTodos(currentPosts => [...currentPosts, newPost]);
        setTitle('');
      })
      .catch((error) => {
        setErrorMessage(Error.Add);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisable(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setDeletingTodo(todos.find(todo => todo.id === todoId));

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch((error) => {
        setErrorMessage(Error.Delete);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      })
      .finally(() => {
        setDeletingTodo(undefined);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setUpdatingTodo(todos.find(todo => todo.id === updatedTodo.id));

    todoService.updateTodo(updatedTodo)
      .then((newTodo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch((error) => {
        setErrorMessage(Error.Update);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        // setIsEdit(false);
        throw error;
      })
      .finally(() => {
        setUpdatingTodo(undefined);
      });
  };

  const filterTodos = (query: Filter) => {
    switch (query) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.All:
      default:
        return todos;
    }
  };

  const visibleTodos = filterTodos(filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          setTitle={setTitle}
          addTodo={addTodo}
          updateTodo={updateTodo}
          isDisable={isDisable}
          setErrorMessage={setErrorMessage}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              // isEdit={isEdit}
              // setIsEdit={setIsEdit}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              updatingTodo={updatingTodo}
              deletingTodo={deletingTodo}
            />

            <Footer
              todos={todos}
              filter={filter}
              setFilter={setFilter}
              deleteTodo={deleteTodo}
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
