/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import classNames from 'classnames';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotifaction } from './components/ErrorNotification';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { FilterTypes } from './types/FilterTypes';
import { ErrorMessage } from './types/ErrorMessage';
import { filterTodos } from './helper/utilsFunctions';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<FilterTypes>(
    FilterTypes.All,
  );

  const completedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const filteredTodos = filterTodos(todos, selectedTodos);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoRenaming, setIsTodoRenaming] = useState(false);
  const [renameTodoTitle, setRenameTodoTitle] = useState('empty');
  const [isDeletedTodoHasLoader, setIsDeletedTodoHasLoader] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const areTodosExist = !!todos.length;

  const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const isAnyCompletedTodos = notCompletedTodosCount === filteredTodos.length;
  const areAllTodosCompleted = notCompletedTodosCount === 0;
  const allNotCompletedTodos = todos.filter(todo => todo.completed === false);

  const handleError = (error: string) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadingError));
  }, []);

  function handleDeleteTodoClick(todoId: number) {
    setIsDeletedTodoHasLoader(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(currTodo => todoId !== currTodo.id),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodoError);
      })
      .finally(() => setIsDeletedTodoHasLoader(false));
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div
      className={classNames('todoapp', {
        'has-error': Boolean(errorMessage.length),
      })}
    >
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          areAllTodosCompleted={areAllTodosCompleted}
          setTodos={setTodos}
          allNotCompletedTodos={allNotCompletedTodos}
          setTempTodo={setTempTodo}
          isTodoRenaming={isTodoRenaming}
          errorMessage={errorMessage}
          handleError={handleError}
        />
        {areTodosExist && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              handleDeleteTodoClick={handleDeleteTodoClick}
              isDeletedTodoHasLoader={isDeletedTodoHasLoader}
              setTodos={setTodos}
              isTodoRenaming={isTodoRenaming}
              setIsTodoRenaming={setIsTodoRenaming}
              setRenameTodoTitle={setRenameTodoTitle}
              renameTodoTitle={renameTodoTitle}
              handleError={handleError}
            />
            <Footer
              notCompletedTodosCount={notCompletedTodosCount}
              setIsDeletedTodoHasLoader={setIsDeletedTodoHasLoader}
              completedIds={completedIds}
              setTodos={setTodos}
              isAnyCompletedTodos={isAnyCompletedTodos}
              selectedTodos={selectedTodos}
              setSelectedTodos={setSelectedTodos}
              setErrorMessage={setErrorMessage}
            />
          </>
        )}
      </div>

      <ErrorNotifaction
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
