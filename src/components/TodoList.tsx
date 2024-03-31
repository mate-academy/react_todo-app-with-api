/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useState } from 'react';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  getFilteredTodos: Todo[];
  handleDelete: (id: number) => void;
  error: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
  loader: boolean;
};

export const TodoList: React.FC<Props> = ({
  getFilteredTodos,
  handleDelete,
  error,
  todos,
  setTodos,
  tempTodo,
  loader,
}) => {
  const [loaderId, setLoaderId] = useState<number | null>(null);
  const toggleTodoCompletion = (todoId: number) => {
    setLoaderId(todoId);
    const updatedTodos = todos.map(todo => {
      if (todoId === todo.id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);
    setTimeout(() => {
      setLoaderId(null);
    }, 300);
  };

  const handleTodoUpdate = (updatedTodo: Todo) => {
    todoService
      .updateTodo(updatedTodo)
      .then(response => {
        setTodos(currentTodos => {
          const updatedIndex = currentTodos.findIndex(
            todo => todo.id === response.id,
          );

          const updatedTodos = [...currentTodos];

          updatedTodos[updatedIndex] = response;

          return updatedTodos;
        });
      })
      .catch(() => {
        error('Unable to update a todo');
        setTimeout(() => {
          error('');
        }, 3000);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {getFilteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              toggleTodoCompletion={toggleTodoCompletion}
              onDelete={() => handleDelete(todo.id)}
              onUpdate={handleTodoUpdate}
              loader={loader}
              loaderId={loaderId}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key="0" timeout={300} classNames="temp-item">
            <TodoItem
              isLoading={true}
              todo={tempTodo}
              toggleTodoCompletion={() => {}}
              onDelete={() => {}}
              onUpdate={() => {}}
              loaderId={loaderId}
              loader={loader}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
