/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { Errors } from './components/errors/errors';
import { Footer } from './components/footer/footer';
import { ToDoList } from './components/todoList/todoList';
import { Header } from './components/header/header';
import { Todo } from './types/Todo';
import { Status } from './types/status';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('');
  const [idTodo, setIdTodo] = useState(0);
  const [newTodo, setNewTodo] = useState({
    userId: postService.USER_ID,
    title: '',
    completed: false,
  });
  const [loading, setLoading] = useState(false);
  const leftItems = todosFromServer.filter(
    todo => !todo.completed && todo.id !== 0,
  );
  const completedItems = todosFromServer.filter(todo => todo.completed);

  useEffect(() => {
    postService
      .getTodos()
      .then(todosArr => {
        setTodosFromServer(todosArr);
        setTodos(todosArr);
      })
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const filterTodos = useCallback(() => {
    switch (status) {
      case Status.active:
        return todosFromServer.filter(todo => !todo.completed);
      case Status.completed:
        return todosFromServer.filter(todo => todo.completed);
      default:
        return todosFromServer;
    }
  }, [status, todosFromServer]);

  useEffect(() => {
    setTodos(filterTodos());
  }, [filterTodos]);

  function onDeleteTodo(todoId: number) {
    setErrorMessage('');
    setIdTodo(todoId);

    return postService
      .deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(error => {
        setTodosFromServer(todos);
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  }

  function onCreateTodo(newToDo: Omit<Todo, 'id'>) {
    setErrorMessage('');
    const todoTrim = { ...newToDo, title: newToDo.title.trim() };

    setTodosFromServer(currentTodos => [
      ...currentTodos,
      { ...newTodo, id: 0 },
    ]);
    setIdTodo(0);

    return postService
      .createTodo(todoTrim)
      .then(todo => {
        setTodosFromServer(todos);
        setTodosFromServer(currentTodos => [...currentTodos, todo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setTodosFromServer(todos);
        throw error;
      });
  }

  function onUpdateTodo(updateTodo: Todo) {
    setErrorMessage('');

    return postService
      .updateTodo(updateTodo)
      .then(todo => {
        setTodosFromServer(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(item => item.id === updateTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        setTodosFromServer(todos);
        throw error;
      });
  }

  function handleChangeTitle(value: string) {
    setErrorMessage('');
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: value,
    }));
  }

  function reset() {
    setNewTodo(currentTodo => ({
      ...currentTodo,
      title: '',
    }));
  }

  async function clearCompletedTodo() {
    completedItems.map(async todo => {
      await postService
        .deleteTodo(todo.id)
        .then(() => {
          setTodosFromServer(currentTodos => {
            return currentTodos.filter(item => item.id !== todo.id);
          });
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        });
    });
  }

  const toggleAll = async () => {
    setLoading(true);
    let todosFilter = todos;

    if (leftItems.length) {
      todosFilter = leftItems;
    }

    todosFilter.map(async item => {
      const updateCompletedTodo = {
        ...item,
        completed: !item.completed,
      };

      await postService
        .updateTodo(updateCompletedTodo)
        .then(todo => {
          setTodosFromServer(currentTodos => {
            const newTodos = [...currentTodos];
            const index = newTodos.findIndex(newUpdateTodo => {
              return newUpdateTodo.id === updateCompletedTodo.id;
            });

            newTodos.splice(index, 1, todo);

            return newTodos;
          });
        })
        .finally(() => setLoading(false));
    });
  };

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          loading={loading}
          todo={newTodo}
          todos={todos}
          leftTodos={leftItems}
          todosFromServer={todosFromServer}
          onSubmit={onCreateTodo}
          onChange={handleChangeTitle}
          onReset={reset}
          onError={setErrorMessage}
          onLoading={setLoading}
          toggleAll={toggleAll}
        />

        <ToDoList
          list={todos}
          idTodo={idTodo}
          onDelete={onDeleteTodo}
          onUpdate={onUpdateTodo}
          onLoading={setLoading}
          onError={setErrorMessage}
          onIdTodo={setIdTodo}
        />

        {!!todosFromServer.length && (
          <Footer
            onClick={setStatus}
            status={status}
            leftItems={leftItems.length}
            completedItems={completedItems}
            onDelete={clearCompletedTodo}
          />
        )}
      </div>

      <Errors errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
