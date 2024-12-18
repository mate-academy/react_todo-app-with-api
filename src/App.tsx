import React, { useEffect, useMemo, useState } from 'react';

import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);
  const [newTitleTodo, setNewTitleTodo] = useState('');

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    if (errorMessage) {
      setErrorMessage('');
    }

    return todoService
      .postTodos({ userId, title, completed })
      .then(newTitle => {
        setTodos(currentTodo => [...currentTodo, newTitle]);
        setNewTitleTodo('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (postId: number) => {
    setTodosInProcess(currentId => [...currentId, postId]);

    return todoService
      .deleteTodos(postId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== postId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setTodosInProcess(currentId => currentId.filter(id => id !== postId));
      });
  };

  const updateTodo = (
    todoId: number,
    newTitle: string,
    completed?: boolean,
  ) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const trimmedTitle = newTitle.trim();
    const updatedTodo = {
      ...todoToUpdate,
      title: trimmedTitle,
      completed: completed ?? todoToUpdate.completed,
    };

    setTodosInProcess(currentId => [...currentId, todoId]);

    return todoService
      .updateTodos(todoId, updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setTodosInProcess(currentId => currentId.filter(id => id !== todoId));
      });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          onErrorMessage={setErrorMessage}
          onSubmit={addTodo}
          setTempTodo={setTempTodo}
          todosInProcess={todosInProcess}
          updateTodo={updateTodo}
          newTitleTodo={newTitleTodo}
          setNewTitleTodo={setNewTitleTodo}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          todosInProcess={todosInProcess}
          updateTodo={updateTodo}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            onFilter={setFilter}
            filter={filter}
            onDelete={deleteTodo}
          />
        )}
      </div>
      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
