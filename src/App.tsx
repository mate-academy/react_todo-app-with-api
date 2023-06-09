/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodos,
  getTodos,
  updateTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './TodosList';
import { InputField } from './InputField';
import { ErrorMessage } from './handleError';
import { Footer } from './Footer';
import TodoItem from './Todo';

// type TodoStatus = 'all' | 'active' | 'completed';

enum TodoStatus {
  all,
  active,
  completed,
}

const USER_ID = 10627;

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(TodoStatus.all);

  const [isError, setIsError] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleLoadTodos = () => {
    getTodos(USER_ID)
      .then(response => {
        setTodosList(response);
        setVisibleTodos(response);
      })
      .catch((err) => setIsError(err));
  };

  useEffect(() => {
    handleLoadTodos();
  }, []);

  // useEffect(() => {
  //   getTodos(USER_ID)
  //     .then(response => {
  //       setTodosList(response);
  //       setVisibleTodos(response);
  //     })
  //     .catch((errorType) => setIsError(errorType));
  // }, []);

  useEffect(() => {
    if (tempTodo) {
      addTodo(USER_ID, tempTodo)
        .then((response: Todo) => {
          setTodosList(prev => [...prev, response]);
        })
        .catch((err: string) => setIsError(err));
    }
  }, [tempTodo]);

  const handleFilterTodos = (newStatus: TodoStatus) => {
    setStatus(newStatus);

    switch (newStatus) {
      case TodoStatus.completed:
        setVisibleTodos(todosList.filter(todo => todo.completed));
        break;
      case TodoStatus.active:
        setVisibleTodos(todosList.filter(todo => !todo.completed));
        break;
      default:
        setVisibleTodos(todosList);
    }
  };

  useEffect(() => {
    setTempTodo(null);
    handleFilterTodos(status);
  }, [todosList]);

  const handleAddNewTodo = (
    event: React.FormEvent<HTMLFormElement>,
    title: string,
  ) => {
    event.preventDefault();

    if (title.trim() !== '') {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      });
    } else {
      setIsError('');
    }
  };

  const handleDeleteTodo = (ids: number[]) => {
    deleteTodos(ids)
      .then(() => {
        setTodosList(prev => prev.filter(todo => !ids.includes(todo.id)));
      })
      .catch((err:string) => setIsError(err));
  };

  const handleClearCompleted = () => {
    const completedTodos = todosList.filter(todo => todo.completed);
    const ids = completedTodos.map(todo => todo.id);

    handleDeleteTodo(ids);
  };

  const handleUpdateTodo = (ids: number[], value: Partial<Todo>) => {
    updateTodos(ids, value)
      .then(() => handleLoadTodos())
      .catch((err) => setIsError(err));
  };

  const handleCompleteAll = () => {
    const activeTodos = todosList.filter(todo => !todo.completed);
    const ids = activeTodos.length > 0
      ? activeTodos.map(todo => todo.id)
      : todosList.map(todo => todo.id);

    const currentStatus = activeTodos.length > 0;

    updateTodos(ids, { completed: currentStatus })
      .then(() => handleLoadTodos())
      .catch((err) => setIsError(err));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <InputField
          hasTodos={todosList.length > 0}
          handleAddNewTodo={handleAddNewTodo}
          isActive={todosList.filter(todo => todo.completed).length === todosList.length}
          handleCompleteAll={handleCompleteAll}
        />
        {todosList.length > 0 && (
          <>
            <section className="todoapp__main">
              <TodosList
                visibleTodos={visibleTodos}
                handleDeleteTodo={handleDeleteTodo}
                handleUpdateTodo={handleUpdateTodo}
              />
              {tempTodo && <TodoItem todo={tempTodo} isTemp />}
            </section>
            <Footer
              handleFilterTodos={handleFilterTodos}
              handleClearCompleted={handleClearCompleted}
              status={status}
              todosList={todosList}
            />
          </>
        )}
      </div>
      {isError !== ''
      && <ErrorMessage handleSetError={setIsError} errorMess={isError} />}
    </div>
  );
};
