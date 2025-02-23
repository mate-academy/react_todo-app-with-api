import React, { FormEvent, useEffect, useState } from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';
import { ErrorBox } from './components/ErrorBox';
import { Filter } from './utils/Filter';
import { filterTodos } from './utils/todoFilter';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateCompletedTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorText } from './utils/ErrorText';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompletedTodo, setIsCopletedTodo] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const prepedTodos = filterTodos(todos, filter);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const isEveryActive =
    todos.every(todo => todo.completed) && todos.length !== 0;
  const haveCompleted = todos.some(todo => todo.completed);

  const setArrayById = (id: number, newTitle: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, title: newTitle } : todo,
      ),
    );
  };

  const createTodo = (
    event: FormEvent,
    todoText: string,
    setTodoText: (value: string) => void,
  ) => {
    event.preventDefault();
    const normalizeText = todoText
      .split(' ')
      .filter(symbol => symbol !== '')
      .join(' ');

    setIsLoading(true);
    if (!normalizeText) {
      setErrorMessage(ErrorText.TitleEmpty);
      setIsLoading(false);

      return;
    }

    setTempTodo({
      title: normalizeText,
      userId: USER_ID,
      completed: false,
      id: 0,
    });
    addTodo({ title: normalizeText, userId: USER_ID, completed: false })
      .then(currentTodo => {
        setTodos(prevTodos => [...prevTodos, currentTodo]);
        setTodoText('');
      })
      .catch(() => setErrorMessage(ErrorText.TodoAdd))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setIsLoading(true);
    setIsCopletedTodo(prevTodos => [...prevTodos, id]);
    deleteTodo(id)
      .then(() => setTodos(prevTodo => prevTodo.filter(elem => elem.id !== id)))
      .catch(() => setErrorMessage(ErrorText.TodoDelete))
      .finally(() => {
        setIsLoading(false);
        setIsCopletedTodo(prevTodos =>
          prevTodos.filter(todoId => todoId !== id),
        );
      });
  };

  const handleDeleteCompletedTodos = () => {
    setIsLoading(true);
    const filteredCompletedTodos = todos.filter(todo => todo.completed);

    setIsCopletedTodo(prevTodo => [
      ...prevTodo,
      ...filteredCompletedTodos.map(todo => todo.id),
    ]);
    Promise.all(
      filteredCompletedTodos.map(completedTodo =>
        deleteTodo(completedTodo.id)
          .then(() =>
            setTodos(prevTodos =>
              prevTodos.filter(prevTodo => prevTodo.id !== completedTodo.id),
            ),
          )
          .catch(() => setErrorMessage(ErrorText.TodoDelete))
          .finally(() => {
            setIsLoading(false);
            setIsCopletedTodo([]);
          }),
      ),
    );
  };

  const handleUpdateTodo = (id: number, currentStatus: boolean) => {
    setIsLoading(true);
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate?.id) {
      return;
    }

    setIsCopletedTodo(prevTodo => [...prevTodo, todoToUpdate.id]);

    if (!todoToUpdate) {
      setErrorMessage(ErrorText.NotFound);
      setIsLoading(false);

      return;
    }

    updateCompletedTodo({
      id,
      completed: !currentStatus,
      userId: todoToUpdate.userId,
      title: todoToUpdate.title,
    })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !currentStatus } : todo,
          ),
        );
      })
      .catch(() => setErrorMessage(ErrorText.TodoUpdate))
      .finally(() => {
        setIsLoading(false);
        setIsCopletedTodo([]);
      });
  };

  const handleToggleAllTodos = () => {
    setIsLoading(true);
    const isEveryCompleted = todos.every(todo => todo.completed);
    const isNotComplited = todos.filter(
      todo => todo.completed === isEveryCompleted,
    );

    setIsCopletedTodo(prevTodo => [
      ...prevTodo,
      ...isNotComplited.map(todo => todo.id),
    ]);

    Promise.all(
      isNotComplited.map(todo =>
        updateCompletedTodo({
          id: todo.id,
          completed: todo.completed,
          userId: todo.userId,
          title: todo.title,
        })
          .then(() => {
            setTodos(prevTodos =>
              prevTodos.map(prevTodo => ({
                ...prevTodo,
                completed: !isEveryCompleted,
              })),
            );
          })
          .catch(() => setErrorMessage(ErrorText.TodoUpdate))
          .finally(() => {
            setIsLoading(false);
            setIsCopletedTodo([]);
          }),
      ),
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorText.TodoLoad))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isEveryActive={isEveryActive}
          createTodo={createTodo}
          isLoading={isLoading}
          todos={todos}
          handleToggleAllTodos={handleToggleAllTodos}
          errorMessage={errorMessage}
        />
        <TodoMain
          todos={prepedTodos}
          isLoading={isLoading}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
          isCompletedTodo={isCompletedTodo}
          setErrorMessage={setErrorMessage}
          setArrayById={setArrayById}
        />

        {todos.length !== 0 && (
          <TodoFooter
            setFilter={setFilter}
            activeTodosCount={activeTodosCount}
            filter={filter}
            haveCompleted={haveCompleted}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorBox errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
