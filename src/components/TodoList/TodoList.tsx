import { memo } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  onCompletedChange: (todoId: number, completed: boolean) => Promise<void>;
  tempTodo: Todo | null;
  onTitleChange: (todoId: number, title: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = memo(
  ({
    todos,
    onDelete,
    tempTodo,
    onCompletedChange,
    onTitleChange,
  }) => {
    const isCreating = tempTodo?.id === 0;

    return (
      <section className="todoapp__main">
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDelete}
                onCompletedChange={onCompletedChange}
                onTitleChange={onTitleChange}
              />
            </CSSTransition>
          ))}

          {isCreating && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={tempTodo}
                tempTodoId={tempTodo.id}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);
