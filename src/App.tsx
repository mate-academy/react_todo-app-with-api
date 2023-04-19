/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import {
  addTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

const USER_ID = 7011;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingTodoId, setDeletingTodoId] = useState(0);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  const isActiveTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    const clearErrorMessage = () => {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    };

    if (errorMessage && errorMessage.length > 0) {
      clearErrorMessage();
    }
  }, [errorMessage]);

  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (selectedStatus) {
        case Status.Active:
          return !todo.completed;
        case Status.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [selectedStatus, todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      });
  }, []);

  const addNewTodo = (titleInput: string) => {
    if (!titleInput.trim()) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setIsDisabledInput(true);
    setTitle('');

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    addTodo(USER_ID, newTodo)
      .then(result => {
        setTodos(prevTodos => ([...prevTodos, result]));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo!');
      })
      .finally(() => {
        setIsDisabledInput(false);
        setTempTodo(null);
      });
  };

  const removeTodo = async (id: number) => {
    setDeletingTodoId(id);

    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoId(0);
      });
  };

  const removeTodoCompleted = () => {
    setIsDeletingCompleted(true);

    completedTodos.forEach(todo => {
      removeTodo(todo.id)
        .then(() => {
          setTodos(isActiveTodos);
        });
      setIsDeletingCompleted(false);
    });
  };

  const changeTodo = (todo: Todo) => {
    updateTodo(todo)
      .then(res => {
        setTodos(prevTodos => (
          prevTodos.map(prevTodo => (
            prevTodo.id === todo.id ? res : prevTodo
          ))
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      });
  };

  const handleToggleTodo = (todo: Todo) => {
    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    changeTodo(newTodo);
  };

  const handleToggleAllTodos = () => {
    todos.forEach(todo => {
      changeTodo({
        ...todo,
        completed: Boolean(isActiveTodos.length),
      });
    });
  };

  const handleChangingTitle = (todo: Todo, newTitle: string) => {
    if (!newTitle) {
      removeTodo(todo.id);

      return;
    }

    const newTodo = {
      ...todo,
      title: newTitle,
    };

    changeTodo(newTodo);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isActiveTodos={isActiveTodos}
          title={title}
          handleNewTitle={handleNewTitle}
          onAddNewTodo={addNewTodo}
          isDisabledInput={isDisabledInput}
          onToggleAllTodos={handleToggleAllTodos}
        />
        <TodoList
          todosToShow={filteredTodos}
          tempTodo={tempTodo}
          onRemoveTodo={removeTodo}
          deletingTodoId={deletingTodoId}
          isDeletingCompleted={isDeletingCompleted}
          onChangeTitle={handleChangingTitle}
          onToggleTodo={handleToggleTodo}
        />
        {!!todos.length && (
          <Footer
            todosToShow={filteredTodos}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            onRemoveTodoCompleted={removeTodoCompleted}
            completedTodos={completedTodos}
          />
        )}
      </div>
      {errorMessage && (
        <Notification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
