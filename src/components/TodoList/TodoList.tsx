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
  isTodoLoading: (id: number) => boolean;
  handleUpdateTodoCompleted: (id: number) => void;
  changeTitleByDoubleClick: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodo,
    handleRemoveTodo,
    isTodoLoading,
    handleUpdateTodoCompleted,
    changeTitleByDoubleClick,
  }) => {
    return (
      <TransitionGroup>
        {todos.map(todo => {
          const isInDeleteList = isTodoLoading(todo.id);

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
                isInDeleteList={isInDeleteList}
                handleUpdateTodoCompleted={handleUpdateTodoCompleted}
                changeTitleByDoubleClick={changeTitleByDoubleClick}
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
              isInDeleteList
              handleUpdateTodoCompleted={handleUpdateTodoCompleted}
              changeTitleByDoubleClick={changeTitleByDoubleClick}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  },
);
