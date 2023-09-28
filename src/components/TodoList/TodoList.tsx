import React from 'react';
import { TodoElement } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((current: Todo[]) => Todo[])) => void
  tempTodo: Todo | null
  setErrorMessage: (message: string) => void
  loadingItems: number[]
  setLoadingItems: (id: (prevState: number[]) => number[]) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setErrorMessage,
  loadingItems,
  setLoadingItems,
}) => {
  const removeTodo = (id: number) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const updateTodos = (todo: Todo) => {
    setTodos((current) => current
      .map((v) => (v.id === todo.id ? todo : v)));
  };

  const handleTodoStatusChange = (todo: Todo) => {
    setLoadingItems((prevState) => [...prevState, todo.id]);

    const data = {
      ...todo,
      completed: !todo.completed,
    };

    client
      .patch<Todo>(`/todos/${todo.id}`, data)
      .then(() => {
        updateTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingItems((prevState) => prevState
          .filter((stateId) => todo.id !== stateId));
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => {
        return (
          <TodoElement
            key={todo.id}
            todo={todo}
            handleTodoStatusChange={handleTodoStatusChange}
            setErrorMessage={setErrorMessage}
            removeTodo={removeTodo}
            setLoadingItems={setLoadingItems}
            loadingItems={loadingItems}
            updateTodos={updateTodos}
          />
        );
      })}
      {tempTodo !== null && (
        <TodoElement
          todo={tempTodo}
          handleTodoStatusChange={handleTodoStatusChange}
          setLoadingItems={setLoadingItems}
          loadingItems={loadingItems}
          updateTodos={updateTodos}
        />
      )}
    </section>
  );
};
