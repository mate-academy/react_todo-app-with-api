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
  tempTodos: Todo | null
  handleRemoveTodo: (id: number) => void;
  loadingTodoIds: number[];
  handleUpdateTodoCompleted: (id: number) => void;
  changeTitleByDoubleClick: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodos,
    handleRemoveTodo,
    loadingTodoIds,
    handleUpdateTodoCompleted,
    changeTitleByDoubleClick,
  }) => {
    return (
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              key={todo.id}
              handleRemoveTodo={handleRemoveTodo}
              loadingTodoIds={loadingTodoIds}
              handleUpdateTodoCompleted={handleUpdateTodoCompleted}
              changeTitleByDoubleClick={changeTitleByDoubleClick}
            />
          </CSSTransition>
        ))}

        {tempTodos && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              key={tempTodos.id}
              todo={tempTodos}
              loadingTodoIds={[0]}
              handleUpdateTodoCompleted={handleUpdateTodoCompleted}
              changeTitleByDoubleClick={changeTitleByDoubleClick}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  },
);
