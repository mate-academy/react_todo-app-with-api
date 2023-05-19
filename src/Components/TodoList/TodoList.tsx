import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (todoToDelete: Todo) => void;
  tempTodo: Todo | null;
  updateTodo: (todoId: number, completed: boolean) => Promise<void>;
  handleTitleEdit: (todoId: number, titles: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  updateTodo,
  handleTitleEdit,
}) => {
  const createTodo = tempTodo?.id === 0;

  return (
    <section className="todoapp__main">
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
              onDelete={onDelete}
              updateTodo={updateTodo}
              updateTitle={handleTitleEdit}
            />
          </CSSTransition>
        ))}

        {createTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              tempTodoId={tempTodo.id}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
