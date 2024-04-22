/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getCount,
  getNewTodoId,
  getTodos,
  getVisibleTodos,
} from './api/todos';
import { Todo, Status } from './types/Todo';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { ErrorNotifications } from './components/errorNotifications';
import { Header } from './components/header';

export const App: React.FC = () => {
  const [preparedTodos, setPreparedTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>(Status.All);
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState<string>('');

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setPreparedTodos(todosFromServer);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getVisibleTodos(preparedTodos, selectedFilter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setPreparedTodos={setPreparedTodos}
          preparedTodos={preparedTodos}
          todos={visibleTodos}
          title={title}
          setTitle={setTitle}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          todoId={getNewTodoId(preparedTodos)}
          setIsSubmitting={setIsSubmitting}
          isSubmitting={isSubmitting}
          setTempTodo={setTempTodo}
          setTodosInProcess={setTodosInProcess}
          todosInProcess={todosInProcess}
        />

        {!!preparedTodos?.length && (
          <>
            <TodoList
              todos={visibleTodos}
              setPreparedTodos={setPreparedTodos}
              tempTodo={tempTodo}
              todosInProcess={todosInProcess}
              setTodosInProcess={setTodosInProcess}
              setErrorMessage={setErrorMessage}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              setUpdatedTitle={setUpdatedTitle}
              updatedTitle={updatedTitle}
            />

            <Footer
              setPreparedTodos={setPreparedTodos}
              selectedFilter={selectedFilter}
              onSelect={setSelectedFilter}
              count={getCount(preparedTodos)}
              todos={visibleTodos}
              setTodosInProcess={setTodosInProcess}
              setErrorMessage={setErrorMessage}
            />
          </>
        )}
      </div>

      <ErrorNotifications message={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
