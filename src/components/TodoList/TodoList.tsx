import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (id: number) => void,
  updateTodoId: number[],
  tempTodo: Todo | null,
  changeStatus: (id: number, property: Partial<Todo>) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  tempTodo,
  updateTodoId,
  changeStatus,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              key={todo.id}
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              updateTodoId={updateTodoId}
              changeStatus={changeStatus}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              key={tempTodo.id}
              handleDeleteTodo={handleDeleteTodo}
              updateTodoId={updateTodoId}
              changeStatus={changeStatus}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
