import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { errorMessages, ErrorMessages } from './types/ErrorMessages';
import { TodoServiceAPI } from './service/todoServiceAPI';
import { USER_ID } from './api/todos';
import { getFilteredList } from './utils/getFilteredList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { ErrorNote } from './components/ErrorNote/ErrorNote';

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isClearTitle, setIsClearTitle] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState<ErrorMessages | null>(null);

  useEffect(() => {
    TodoServiceAPI.getTodos()
      .then(data => setTodosList(data))
      .catch(() => {
        setError(errorMessages.load);
      });
  }, []);

  function handleHideError() {
    setError(null);
  }

  const filteredTodos = getFilteredList(filter, todosList);
  const activeTodos = getFilteredList(Filter.active, todosList);
  const completedTodos = getFilteredList(Filter.completed, todosList);

  function handleAddingTodo(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const title = event.currentTarget.value.trim();

      if (!title) {
        setError(errorMessages.title);

        return;
      }

      setIsSubmiting(true);
      setTempTodo({
        title,
        userId: USER_ID,
        completed: false,
        id: 0,
      });

      TodoServiceAPI.addTodo(title)
        .then(newTodo => {
          setTodosList(prevList => [...prevList, newTodo]);
          setIsClearTitle(true);
        })
        .catch(() => setError(errorMessages.add))
        .finally(() => {
          setIsSubmiting(false);
          setTempTodo(null);
        });
    }
  }

  function handleDeleteTodo(deleteTodoIds: number[]) {
    setTodosList(prevTodoList =>
      prevTodoList.filter(({ id }) => !deleteTodoIds.includes(id)),
    );
  }

  function handleUpdateTodoList(updatedTodo: Todo) {
    const copyTodoList = [...todosList];
    const indexUpdatedTodo = copyTodoList.findIndex(
      ({ id }) => updatedTodo.id === id,
    );

    copyTodoList.splice(indexUpdatedTodo, 1, updatedTodo);
    setTodosList(copyTodoList);
  }

  function handleToggleAllTodos() {
    const todoToReverseComplete =
      activeTodos.length > 0 ? activeTodos : todosList;
    const promiseMap = todoToReverseComplete.map(({ id, completed }) =>
      TodoServiceAPI.toggleCompleteTodo(id, !completed),
    );

    Promise.all(promiseMap)
      .then(results => {
        let updatedTodoList: Todo[] = [];

        if (todoToReverseComplete.length === todosList.length) {
          updatedTodoList = results;
        } else {
          todosList.forEach(todo => {
            const findUpdateTodo = results.find(({ id }) => todo.id === id);

            updatedTodoList.push(findUpdateTodo || todo);
          });
        }

        setTodosList(updatedTodoList);
      })
      .catch(() => setError(errorMessages.update));
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todoList={todosList}
          isSubmiting={isSubmiting}
          isClearTitle={isClearTitle}
          onSetIsClearTitle={setIsClearTitle}
          onHandleAddingTodo={handleAddingTodo}
          onHandleToggleAllTodos={handleToggleAllTodos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos?.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onSetError={setError}
              onHandleDeleteTodo={handleDeleteTodo}
              onUpdateTodoList={handleUpdateTodoList}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isSubmiting={isSubmiting}
              onSetError={setError}
            />
          )}
        </section>

        {todosList.length > 0 && (
          <TodoFooter
            currentFilter={filter}
            activeListLength={activeTodos.length}
            completedTodos={completedTodos}
            onSetFilter={setFilter}
            onSetError={setError}
            onHandleDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>
      <ErrorNote error={error} onHandleHideError={handleHideError} />
    </div>
  );
};
