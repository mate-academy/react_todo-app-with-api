import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  todoTemplate: Todo;
  isAdding: boolean;
  handleDeleteTodo: (id: number) => void;
  selectedId: number[];
  editTodo: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoTemplate,
  isAdding,
  handleDeleteTodo,
  selectedId,
  editTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            key={todo.id}
            handleDeleteTodo={handleDeleteTodo}
            selectedId={selectedId}
            editTodo={editTodo}
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
            handleDeleteTodo={handleDeleteTodo}
            selectedId={[0]}
            editTodo={editTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
