import React from 'react';
import { TodoError, Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  complateTodo: (todo: Todo) => void;
  setLoadingTodoId: (id: number[] | null) => void;
  loadingTodoId: number[] | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  showError: (error: TodoError) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  removeTodo,
  complateTodo,
  setLoadingTodoId,
  loadingTodoId,
  setTodos,
  showError,
}) => {
  return (
    <TransitionGroup component={null}>
      {visibleTodos.map(todoItem => (
        <CSSTransition key={todoItem.id} timeout={300} classNames="item">
          <TodoItem
            key={todoItem.id}
            {...{
              todoItem,
              removeTodo,
              complateTodo,
              setLoadingTodoId,
              isLoading: loadingTodoId?.includes(todoItem.id) || false,
              showError,
              setTodos,
            }}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoItem
            {...{
              todoItem: tempTodo,
              removeTodo,
              complateTodo,
              isLoading: true,
            }}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
