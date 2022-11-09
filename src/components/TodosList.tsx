import React, { useContext } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { ErrorsType } from '../types/ErrorsType';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';
import { TodoAddCard } from './TodoAddCard';
import { TodoCard } from './TodoCard';

import '../styles/transition.css';

type Props = {
  todos: Todo[];
  getTodosList: () => Promise<void>,
  setErrors: React.Dispatch<React.SetStateAction<ErrorsType[]>>,
  isLoadingTodos: number[],
  setIsLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>,
  newTodoTitle: string,
};

export const TodosList: React.FC<Props> = ({
  todos,
  getTodosList,
  setErrors,
  isLoadingTodos,
  setIsLoadingTodos,
  newTodoTitle,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoCard
              todo={todo}
              getTodosList={getTodosList}
              setErrors={setErrors}
              isLoadingTodos={isLoadingTodos}
              setIsLoadingTodos={setIsLoadingTodos}
              key={todo.id}
            />
          </CSSTransition>
        ))}

        {isLoadingTodos.includes(0) && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoAddCard
              todo={{
                id: 0,
                title: newTodoTitle || 'no Title',
                completed: false,
                userId: user ? user.id : 0,
              }}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
