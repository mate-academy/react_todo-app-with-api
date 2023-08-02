import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onDeleteTodo:(id: number) => void;
  onUpdateTodo: (todoId: number, args: Partial<Todo>) => Promise<void>,
  updatingTodos: number[];
  tempTodo : Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updatingTodos,
  tempTodo,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={3000}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDeleteTodo={() => onDeleteTodo(todo.id)}
              onUpdateTodo={onUpdateTodo}
              isUpdating={updatingTodos.includes(todo.id)}
            />

          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={3000}
            classNames="temp-item"
          >

            <TempTodo
              todo={tempTodo}
              isLoading
            />

          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
