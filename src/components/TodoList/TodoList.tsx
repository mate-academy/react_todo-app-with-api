import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../Todo';
import { TodoType } from '../../types/TodoType';
import React from 'react';

type TodoListProps = {
  tempTodo: TodoType | null;
  isLoading: boolean;
  handleDeleteTodo: (todoId: number) => void;
  handleUpdateTodo?: (todoId: number, data: unknown) => void;
  isUpdatingTodos?: boolean;
  updatingTodosIds?: number[];
  filteredTodos?: TodoType[];
  todos?: TodoType[];
  handleTodoEditSubmit?: (
    todo: TodoType,
    todoQuery: string,
    setTodoQuery?: React.Dispatch<React.SetStateAction<string>>,
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>,
    e?: React.FormEvent<HTMLFormElement>,
  ) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  tempTodo,
  isLoading,
  handleDeleteTodo,
  handleTodoEditSubmit,
  handleUpdateTodo,
  updatingTodosIds,
  filteredTodos,
  todos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos?.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <Todo
              key={todo.id}
              todo={todo}
              isLoading={isLoading}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateTodo={handleUpdateTodo}
              updatingTodosIds={updatingTodosIds}
              filteredTodos={filteredTodos}
              todos={todos}
              handleTodoEditSubmit={handleTodoEditSubmit}
            />
          </CSSTransition>
        ))}
        {isLoading && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <Todo
              todo={tempTodo || null}
              isLoading={isLoading}
              handleDeleteTodo={handleDeleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
