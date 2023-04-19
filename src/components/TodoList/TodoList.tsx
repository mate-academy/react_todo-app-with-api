import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TododInfo/TodoInfo';
import './todoList.scss';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null
  handleRemoveTodo: (id: number) => void;
  getIsTodoLoading: (id: number) => boolean;
  handleChangeTodoStatus: (id: number) => void;
  changeTitle: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodo,
    handleRemoveTodo,
    getIsTodoLoading,
    handleChangeTodoStatus,
    changeTitle,
  }) => {
    return (
      <TransitionGroup>
        {todos.map(todo => {
          const isLoading = getIsTodoLoading(todo.id);

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoInfo
                todo={todo}
                key={todo.id}
                handleRemoveTodo={handleRemoveTodo}
                isLoading={isLoading}
                handleChangeTodoStatus={handleChangeTodoStatus}
                changeTitle={changeTitle}
              />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              key={tempTodo.id}
              todo={tempTodo}
              isLoading
              handleChangeTodoStatus={handleChangeTodoStatus}
              changeTitle={changeTitle}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  },
);
