import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import '../../styles/animation.scss';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null,
  tempTodos: Todo[],
  removeTodo:(id: number) => void,
  handlerStatus:(todo: Todo) => void,
  upgradeTodoFromServer:(todo: Todo) => void,
  deleteTodoFromServer:(id: number) => void,
};

export const TodoList:React.FC<Props> = React.memo(
  ({
    todos,
    tempTodo,
    tempTodos,
    removeTodo,
    handlerStatus,
    upgradeTodoFromServer,
    deleteTodoFromServer,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {/* This is a completed todo */}
          {todos.map(todo => {
            const isLoading = tempTodos.some(t => t.id === todo.id);

            return (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  isLoading={isLoading}
                  removeTodo={removeTodo}
                  handlerStatus={handlerStatus}
                  upgradeTodoFromServer={upgradeTodoFromServer}
                  deleteTodoFromServer={deleteTodoFromServer}
                />
              </CSSTransition>
            );
          })}
          {tempTodo && (
            <CSSTransition
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={tempTodo}
                isLoading
                removeTodo={removeTodo}
                handlerStatus={handlerStatus}
                upgradeTodoFromServer={upgradeTodoFromServer}
                deleteTodoFromServer={deleteTodoFromServer}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);
