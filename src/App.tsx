/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { SelectStatus } from './types/SelectStatus';
import { TodoError } from './types/TodoError';
import { ErrorTab } from './components/ErrorTab';
import * as todoService from './api/todos';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(SelectStatus.All);
  const [errorMesage, setErrorMesage] = useState(TodoError.empty);
  const [newAddedTodoId, setNewAddedTodoId] = useState<number | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [changedStatusIds, setChangedStatusIds] = useState<number[]>([]);

  const getFilteredTodos = (todos: Todo[]) => {
    const filteredTodos = [...todos];

    switch (selectedStatus) {
      case SelectStatus.Active:
        return filteredTodos.filter(todo => !todo.completed);

      case SelectStatus.Completed:
        return filteredTodos.filter(todo => todo.completed);

      default:
        return filteredTodos;
    }
  };

  const visibleTodos = getFilteredTodos(todosFromServer);

  const deleteCompletedTodos = () => {
    const completedTodos = visibleTodos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      setChangedStatusIds(ids => [...ids, todo.id]);

      return (
        todoService.deleteTodo(String(todo.id))
      );
    });

    Promise.all(deletePromises)
      .then(() => {
        const remainingTodos = visibleTodos.filter(todo => !todo.completed);

        setTodosFromServer(remainingTodos);
      })
      .catch(() => {
        setErrorMesage(TodoError.delete);
      })
      .finally(() => setChangedStatusIds([]));
  };

  const toggleTodoStatus = async ({
    id,
    title,
    userId,
    completed,
  }: Todo) => {
    try {
      const newTodos = visibleTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !completed };
        }

        return todo;
      });

      setTodosFromServer(newTodos);
      setSelectedTodoId(id);

      await todoService.updateTodo({
        id,
        title,
        userId,
        completed: !completed,
      });
    } catch {
      setErrorMesage(TodoError.update);
      setTodosFromServer(visibleTodos);
    } finally {
      setSelectedTodoId(null);
    }
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          setTodosFromServer={setTodosFromServer}
          setErrorMesage={setErrorMesage}
          setNewAddedTodoId={setNewAddedTodoId}
          setChangedStatusIds={setChangedStatusIds}
        />
        <Main
          todos={visibleTodos}
          setTodosFromServer={setTodosFromServer}
          setErrorMesage={setErrorMesage}
          newAddedTodoId={newAddedTodoId}
          selectedTodoId={selectedTodoId}
          setSelectedTodoId={setSelectedTodoId}
          toggleTodoStatus={toggleTodoStatus}
          changedStatusIds={changedStatusIds}
        />
        {todosFromServer.length > 0
          && (
            <Footer
              filteredTodos={visibleTodos}
              todosFromServer={todosFromServer}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          )}
      </div>

      {errorMesage && (
        <ErrorTab
          errorMesage={errorMesage}
          setErrorMesage={setErrorMesage}
        />
      )}
    </div>
  );
};
