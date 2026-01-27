import React, { useState, useEffect, useRef } from 'react';
import { TodoappHeader } from './components/TodoappHeader';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoappErrorsBlock } from './components/TodoappErrorsBlock';
import { TodoappFooter } from './components/TodoappFooter';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoListItem } from './components/TodoListItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const todoInputRef = useRef<HTMLInputElement>(null);

  const hasTodos = todos.length > 0;
  const allCompleted = todos.every(todo => todo.completed) && hasTodos;

  const showError = (text: ErrorMessage | '') => {
    setErrorMessage(text);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.LoadTodos));
  }, []);

  const handleAddTodo = (title: string): Promise<void> => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
    });

    return createTodo({
      title,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        showError(ErrorMessage.AddTodo);
        setTempTodo(null);

        throw new Error();
      });
  };

  const handleDeleteTodo = (todoId: number): Promise<void> => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        todoInputRef.current?.focus();
      })
      .catch(() => {
        showError(ErrorMessage.DeleteTodo);
      })
      .finally(() =>
        setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId)),
      );
  };

  const handleDeleteAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prevIds => [...prevIds, ...completedIds]);

    const promises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => null),
    );

    Promise.all(promises)
      .then(results => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => !results.includes(todo.id)),
        );

        if (results.includes(null)) {
          showError(ErrorMessage.DeleteTodo);
        }

        todoInputRef.current?.focus();
      })
      .finally(() =>
        setLoadingTodoIds(prevIds =>
          prevIds.filter(id => !completedIds.includes(id)),
        ),
      );
  };

  const handleUpdateTodo = (
    todoId: number,
    data: Partial<Todo>,
  ): Promise<void> => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    return updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        showError(ErrorMessage.UpdateTodo);

        throw new Error();
      })
      .finally(() =>
        setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId)),
      );
  };

  const handleToogleAll = () => {
    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    const shouldComplete = activeTodos.length > 0;

    const todosToUpdate = shouldComplete ? activeTodos : completedTodos;

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingTodoIds(prevIds => [...prevIds, ...idsToUpdate]);

    const promises = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: shouldComplete })
        .then(newTodo => newTodo)
        .catch(() => null),
    );

    Promise.all(promises)
      .then(results => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            const updatedTodo = results.find(res => res && res.id === todo.id);

            return updatedTodo || todo;
          }),
        );

        if (results.includes(null)) {
          showError(ErrorMessage.UpdateTodo);
        }
      })
      .finally(() =>
        setLoadingTodoIds(prevIds =>
          prevIds.filter(id => !idsToUpdate.includes(id)),
        ),
      );
  };

  const visibleTodos = [...todos].filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoappHeader
          hasTodos={hasTodos}
          onToogleAll={handleToogleAll}
          activeToogle={allCompleted}
          todoInputRef={todoInputRef}
          inputValue={inputValue}
          onAddTodo={handleAddTodo}
          onInputChange={setInputValue}
          changeError={showError}
        />
        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={handleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
              onUpdateTodo={handleUpdateTodo}
            />

            {tempTodo && (
              <TodoListItem
                todo={tempTodo}
                onDeleteTodo={handleDeleteTodo}
                changeTodo={handleUpdateTodo}
              />
            )}

            <TodoappFooter
              todos={todos}
              selectedFilter={filter}
              onFilterChange={setFilter}
              onClearCompleted={handleDeleteAllCompleted}
            />
          </>
        )}
      </div>
      <TodoappErrorsBlock
        errorMessage={errorMessage}
        onDelete={setErrorMessage}
      />
    </div>
  );
};
