import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoData } from '../TodoData';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  tempTodo: Todo;
  changingTodosId: number[];
  handleToggleTodo: (todoId: number, completed: boolean) => void;
  isAdding: boolean;
  handleEditTodo: (todoId:number, title: string) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  handleDeleteTodo,
  isAdding,
  tempTodo,
  changingTodosId,
  handleToggleTodo,
  handleEditTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoData
                todo={todo}
                key={todo.id}
                handleDeleteTodo={handleDeleteTodo}
                changingTodosId={changingTodosId}
                handleToggleTodo={handleToggleTodo}
                handleEditTodo={handleEditTodo}
              />
            </CSSTransition>
          );
        })}
        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoData
              todo={tempTodo}
              key={tempTodo.id}
              handleDeleteTodo={handleDeleteTodo}
              changingTodosId={changingTodosId}
              handleToggleTodo={handleToggleTodo}
              handleEditTodo={handleEditTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
