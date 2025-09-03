import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { Processing } from '../types/Processing';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;

  isProcessing: Processing;

  deleteTodoHandle: (todoId: number) => void;
  singleToggleHandle: (id: number, title: string, completed: boolean) => void;
  renameTodoHandle: (value: Todo) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodoHandle,
  singleToggleHandle,
  renameTodoHandle,
  isProcessing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} classNames="item" timeout={300}>
            <TodoItem
              todo={todo}
              deleteTodoHandle={deleteTodoHandle}
              singleToggleHandle={singleToggleHandle}
              renameTodoHandle={renameTodoHandle}
              isProcessing={isProcessing}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} classNames="temp-item" timeout={300}>
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              deleteTodoHandle={deleteTodoHandle}
              singleToggleHandle={singleToggleHandle}
              renameTodoHandle={renameTodoHandle}
              isProcessing={isProcessing}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
