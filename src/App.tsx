/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { FilterTypes } from './types/FilterTypes';
import classNames from 'classnames';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { filterTodos } from './helper/utilsFunctions';
import { ErrorMessage } from './types/ErrorMesage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<FilterTypes>(
    FilterTypes.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeletedTodoHasLoader, setIsDeletedTodoHasLoader] = useState(false);
  const [isTodoRenaming, setIsTodoRenaming] = useState(false);
  const [renameTodoTitle, setRenameTodoTitle] = useState('empty');
  const [errorMessage, setErrorMessage] = useState('');

  const areTodosExist = !!todos.length;
  const completedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const filteredTodos = filterTodos(todos, selectedTodos);

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
      .catch(() => {
        handleError(ErrorMessage.LoadingError);
      });
  }, []);

  function handleDeleteTodoCLick(todoId: number) {
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
              handleDeleteTodoClick={handleDeleteTodoCLick}
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

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
