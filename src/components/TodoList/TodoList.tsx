import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  todoTemplate: Todo;
  isAdding: boolean;
  handleDeleteTodo: (id: number) => void;
  selectedIDs: number[];
  handleEditTodo: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleDeleteTodo,
  isAdding,
  todoTemplate,
  selectedIDs,
  handleEditTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            key={todo.id}
            handleDeleteTodo={handleDeleteTodo}
            selectedIDs={selectedIDs}
            handleEditTodo={handleEditTodo}
          />
        </CSSTransition>
      ))}

      {isAdding && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={todoTemplate}
            selectedIDs={[0]}
            handleDeleteTodo={handleDeleteTodo}
            handleEditTodo={handleEditTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
