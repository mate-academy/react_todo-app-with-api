/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Error, Footer, NewTodo, TodoList } from './components';
import * as todoActions from './api/todos';
import { Todo, FilterOptions, ErrorMessages } from './types';

export const App: React.FC = () => {
  const [currentTodoList, setCurrentTodoList] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState(FilterOptions.ALL);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [todosBeingProcessed, setTodosBeingProcessed] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    todoActions
      .getTodos()
      .then((todos: Todo[]) => {
        setCurrentTodoList(todos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.LOAD_TODO_ERROR);
      });
  }, []);

  const handleCreateTodo = useCallback(
    async ({ title, userId, completed }: Omit<Todo, 'id'>) => {
      setCreating(true);
      setIsInputDisabled(true);

      try {
        const serverNewTodo = await todoActions.createTodo({
          title,
          userId,
          completed,
        });

        setCurrentTodoList(currentTodos => [...currentTodos, serverNewTodo]);
        setInputValue('');
      } catch (error) {
        setCurrentTodoList(currentTodos =>
          currentTodos.filter(todo => todo.id !== 0),
        );
        setErrorMessage(ErrorMessages.CREATE_TODO_ERROR);
      } finally {
        setCreating(false);
        setIsInputDisabled(false);
      }
    },
    [],
  );

  const handleDeleteTodo = useCallback(async (postId: number) => {
    setIsInputDisabled(true);
    setTodosBeingProcessed(currentArray => [...currentArray, postId]);

    try {
      await todoActions.deleteTodo(postId);

      setTimeout(() => {
        setCurrentTodoList(currentTodos =>
          currentTodos.filter(todo => todo.id !== postId),
        );
      }, 200);
      setIsInputDisabled(false);
    } catch (error) {
      setErrorMessage(ErrorMessages.DELETE_TODO_ERROR);
      setCurrentTodoList(currentTodos => currentTodos);
      setTodosBeingProcessed([]);

      throw new Error(ErrorMessages.CATCH_ALL_ERROR);
    }
  }, []);

  const updateTodo = useCallback(async (updatedTodo: Todo) => {
    try {
      setTodosBeingProcessed(currentArray => [...currentArray, updatedTodo.id]);

      const updatedTodoFromServer = await todoActions.editTodo(updatedTodo);

      setCurrentTodoList(currentTodos => {
        return currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodoFromServer : todo,
        );
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.UPDATE_TODO_ERROR);

      throw new Error(ErrorMessages.CATCH_ALL_ERROR);
    } finally {
      setTodosBeingProcessed([]);
    }
  }, []);

  const handleClearCompletedTodos = useCallback(() => {
    const completedTodos = currentTodoList.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  }, [currentTodoList, handleDeleteTodo]);

  const handleFilterChange = useCallback((newFilter: FilterOptions) => {
    setActiveFilter(newFilter);
  }, []);

  const visibleTodos = useMemo(
    () =>
      currentTodoList.filter(todo => {
        switch (activeFilter) {
          case FilterOptions.ACTIVE:
            return !todo.completed;
          case FilterOptions.COMPLETED:
            return todo.completed;
          case FilterOptions.ALL:
          default:
            return true;
        }
      }),
    [activeFilter, currentTodoList],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          currentTodoList={currentTodoList}
          handleCreateTodo={handleCreateTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={isInputDisabled}
          inputValue={inputValue}
          setInputValue={setInputValue}
          updateTodo={updateTodo}
        />

        {visibleTodos && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              visibleTodos={visibleTodos}
              handleDeleteTodo={handleDeleteTodo}
              updateTodo={updateTodo}
              todosBeingProcessed={todosBeingProcessed}
              setErrorMessage={setErrorMessage}
              creating={creating}
              inputValue={inputValue}
            />
          </section>
        )}

        {!!currentTodoList.length && (
          <Footer
            currentTodoList={currentTodoList}
            activeFilter={activeFilter}
            handleFilterChange={handleFilterChange}
            handleClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
