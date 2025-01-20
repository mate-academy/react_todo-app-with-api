/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/Footer/TodoFooter';
import { TodoHeader } from './components/Header/TodoHeader';
import { TodoErrors } from './components/Errors/TodoErrors';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';

export enum ErrorMessage {
  Update = 'Unable to update a todo',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Get = 'Unable to load todos',
  Title = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [filterType, setFilterType] = useState<TodoFilter>(TodoFilter.All);

  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodoList(todosFromServer))
      .catch(err => {
        setErrorMessage(ErrorMessage.Get);
        throw err;
      });
  }, []);

  const completedTodos = useMemo(
    () => todoList.filter(todo => todo.completed),
    [todoList],
  );

  const uncompletedTodos = useMemo(
    () => todoList.filter(todo => !todo.completed),
    [todoList],
  );

  const focusField = () => {
    setTimeout(() => {
      const inputField =
        document.querySelector<HTMLInputElement>('.todoapp__new-todo');

      inputField?.focus();
    }, 0);
  };

  const filterTodos = useMemo(() => {
    switch (filterType) {
      case TodoFilter.All:
        return todoList;
      case TodoFilter.Active:
        return uncompletedTodos;
      case TodoFilter.Completed:
        return completedTodos;
      default:
        return todoList;
    }
  }, [filterType, todoList, uncompletedTodos, completedTodos]);

  const handleAddTodo = async (
    event: React.FormEvent<HTMLFormElement>,
    title: string,
  ) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!title.trim()) {
      setIsLoading(false);
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    setTemporaryTodo({
      title: title.trim(),
      userId: USER_ID,
      completed: false,
      id: 0,
    });

    try {
      const newTodo = await createTodo(title);

      setTodoList([...todoList, newTodo]);

      setNewTodoTitle('');
    } catch {
      setErrorMessage(ErrorMessage.Add);
    } finally {
      setTimeout(() => {
        getTodos();
      }, 300);
      focusField();
      setIsLoading(false);
      setTemporaryTodo(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setErrorMessage('');
    setLoadingTodoIds(prevIds => [...prevIds, id]);
    try {
      const response = await deleteTodo(id);

      if (response === 1) {
        setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== id));
      } else {
        setErrorMessage(ErrorMessage.Delete);
      }
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      focusField();
      setLoadingTodoIds([]);
    }
  };

  const deleteCompletedTodo = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleUpdateStatus = async (todo: Todo) => {
    setErrorMessage('');
    setLoadingTodoIds(prevId => [...prevId, todo.id]);

    const todoToUpdate = todoList.find(item => item.id === todo.id);

    if (!todoToUpdate) {
      setErrorMessage(ErrorMessage.Update);

      return;
    }

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    try {
      await updateTodo(updatedTodo);

      setTodoList(prevTodoList =>
        prevTodoList.map(item =>
          item.id === updatedTodo.id ? updatedTodo : item,
        ),
      );
    } catch {
      setErrorMessage(ErrorMessage.Update);
    } finally {
      setLoadingTodoIds(prevIds =>
        prevIds.filter(todoId => todoId !== todo.id),
      );
    }
  };

  const handleUpdateAllStatus = async () => {
    if (uncompletedTodos.length > 0) {
      uncompletedTodos.forEach(todo => {
        handleUpdateStatus({ ...todo, completed: true });
      });
    } else {
      todoList.forEach(todo => {
        handleUpdateStatus({ ...todo, completed: false });
      });
    }
  };

  const handleChangeTitle = async (
    todo: Todo,
    newTitle: string,
  ): Promise<boolean> => {
    setErrorMessage('');
    setLoadingTodoIds(prevIds => [...prevIds, todo.id]);
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle.trim()) {
      handleDeleteTodo(todo.id);

      return true;
    }

    try {
      await updateTodo({ ...todo, title: newTitle });

      setTodoList(prevTodos =>
        prevTodos.map(item =>
          item.id === todo.id ? { ...item, title: newTitle } : item,
        ),
      );

      return true;
    } catch (error) {
      setErrorMessage(ErrorMessage.Update);

      return false;
    } finally {
      setLoadingTodoIds(prevIds =>
        prevIds.filter(todoId => todoId !== todo.id),
      );
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <section className="section container">
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <TodoHeader
            onUpdateError={setErrorMessage}
            onSetNewTodoTitle={setNewTodoTitle}
            newTodoTitle={newTodoTitle}
            addTodo={handleAddTodo}
            isLoading={isLoading}
            todos={todoList}
            updateStatusAllTodos={handleUpdateAllStatus}
          />
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={filterTodos}
              deleteTodo={handleDeleteTodo}
              todoTemp={temporaryTodo}
              todoIds={loadingTodoIds}
              updateStatusTodo={handleUpdateStatus}
              onChangeTitle={handleChangeTitle}
              errorMessage={errorMessage}
            />
          </section>
          {todoList.length !== 0 && (
            <TodoFooter
              onFilterChange={setFilterType}
              filterType={filterType}
              deleteCompletedTodos={deleteCompletedTodo}
              todosLeft={uncompletedTodos.length}
              completedTodos={completedTodos.length}
            />
          )}
        </div>
        <TodoErrors errors={errorMessage} onUpdateError={setErrorMessage} />
      </div>
    </section>
  );
};
