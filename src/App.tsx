import React, { FormEvent, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as PostService from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/FilterEnum';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './types/ErrorMessageEnum';
import { TodoContext } from './components/TodoContext';
import { Header } from './components/Header';
import { Errors } from './components/Errors';

const USER_ID = 11589;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorOccured, setErrorOccured] = useState('');
  const [filterBy, setFilterBy] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [changingId, setChangingId] = useState<number[]>([]);

  useEffect(() => {
    PostService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorOccured(ErrorMessage.noTodos);
        setTimeout(() => {
          setErrorOccured('');
        }, 3000);
      });
  }, []);

  const handleDelete = (todo: Todo) => {
    setCurrentLoading(true);
    setChangingId([todo.id]);

    return PostService.deleteTodo(todo.id)
      .then(() => setTodos(todos.filter(item => item.id !== todo.id)))
      .catch(() => {
        setTodos(todos);
        setErrorOccured(ErrorMessage.noDeleteTodo);
        setTimeout(() => {
          setErrorOccured('');
        }, 3000);
      })
      .finally(() => {
        setCurrentLoading(false);
        setChangingId([]);
      });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorOccured(ErrorMessage.noTitle);
      setTimeout(() => {
        setErrorOccured('');
      }, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setChangingId([newTodo.id]);
    setCurrentLoading(true);

    setTempTodo(newTodo);

    PostService.createTodo(newTodo)
      .then((createdTodo) => {
        setTodos([...todos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorOccured(ErrorMessage.noAddTodo);
        setTimeout(() => {
          setErrorOccured('');
        }, 3000);
      })
      .finally(() => {
        setCurrentLoading(false);
        setTempTodo(null);
      });
  };

  const handleFilterTodos = () => {
    switch (filterBy) {
      case Status.All:
        return todos;
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const preparedTodos = handleFilterTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoContext.Provider value={{
          todos,
          preparedTodos,
          setTodos,
          setFilterBy,
          filterBy,
          errorOccured,
          setErrorOccured,
          USER_ID,
          setTitle,
          title,
          handleSubmit,
          handleDelete,
          currentLoading,
          changingId,
          setCurrentLoading,
          setChangingId,
        }}
        >
          <Header />
          <TodoList
            todos={preparedTodos}
            tempTodo={tempTodo}
          />

          {todos.length !== 0 && (
            <Footer />
          )}

          <Errors />

        </TodoContext.Provider>
      </div>
    </div>
  );
};
