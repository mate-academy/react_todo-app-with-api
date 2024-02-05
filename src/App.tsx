import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoError } from './components/TodoError/TodoError';
import { Errors } from './types/Errors';
import { Filter } from './types/Filter';
import { prepareTodos } from './utils/helpers';

const USER_ID = 12054;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [errorType, setErrorType] = useState<Errors | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoId, setProcessingTodoId]
    = useState<number | number[] | null>(null);
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    setIsLoading(true);
    todoService.getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch(() => {
        setErrorType(Errors.Load);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDelete = (id: number) => {
    setProcessingTodoId(id);
    todoService.deleteTodo(id)
      .then(() => {
        setTimeout(() => {
          setTodos(currentTodos => currentTodos.filter(post => post.id !== id));
        }, 500);
      })
      .catch(() => {
        setErrorType(Errors.Delete);
      })
      .finally(() => {
        setProcessingTodoId(null);
      });
  };

  const addTodo = (title: string) => {
    setIsLoading(true);
    setProcessingTodoId(0);
    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });
    todoService.addTodo({
      title,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodoTitle('');
        setTimeout(() => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTempTodo(null);
        }, 500);
      })
      .catch(() => {
        setErrorType(Errors.Add);
      })
      .finally(() => {
        setIsLoading(false);
        setProcessingTodoId(null);
      });
  };

  const isThereCompleted = todos.some(todo => todo.completed);

  const filteredTodos = prepareTodos(todos, filterStatus);

  const updateTodo = (updatedTodo: Todo) => {
    setProcessingTodoId(updatedTodo.id);

    todoService.updateTodo(updatedTodo)
      .then(() => setTodos(prev => (
        prev.map(prevTodo => (
          prevTodo.id === updatedTodo.id
            ? updatedTodo
            : prevTodo
        ))
      )))
      .catch(() => setErrorType(Errors.Update))
      .finally(() => {
        setProcessingTodoId(null);
      });
  };

  const toggleAll = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => (isAllCompleted
      ? todo.completed
      : !todo.completed
    ));

    await Promise.all(todosToUpdate.map(todo => (
      updateTodo({
        ...todo,
        completed: !isAllCompleted,
      })
    )));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          todos={todos}
          isLoading={isLoading}
          onAddTodo={addTodo}
          setError={setErrorType}
          onToggleAll={toggleAll}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleDelete}
          processingTodoIds={processingTodoId}
          onUpdateTodo={updateTodo}
        />

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            filterStatus={filterStatus}
            onSetFilter={setFilterStatus}
            isCompleted={isThereCompleted}
            onDeleteTodo={handleDelete}
          />
        )}
      </div>

      {errorType && (
        <TodoError
          errorType={errorType}
          setErrorType={setErrorType}
        />
      )}
    </div>
  );
};
