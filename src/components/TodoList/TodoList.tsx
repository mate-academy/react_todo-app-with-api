import { FC } from 'react';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ErrorsType } from '../../types/ErrorsType';

interface Props {
  todos: Todo[],
  deleteTodo: (todo: Todo) => void,
  isDeletedCompleted: boolean,
  tempTodo: Todo | null,
  handleEditTodo: (todo: Todo) => void,
  displayError: (error: ErrorsType) => void,
}

export const TodoList: FC<Props> = ({
  todos,
  deleteTodo,
  isDeletedCompleted,
  tempTodo,
  handleEditTodo,
  displayError,
}) => {
  const isDelete = tempTodo?.id === 0;

  return (
    <section className={cn('todoapp__main', { hidden: todos.length === 0 })}>
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={500}
            className="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              deleteTodo={deleteTodo}
              isDeleted={todo.completed && isDeletedCompleted}
              handleEditTodo={handleEditTodo}
              displayError={displayError}
            />
          </CSSTransition>
        ))}

        {isDelete && (
          <CSSTransition
            key={0}
            timeout={500}
            className="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              todoId={tempTodo.id}
              handleEditTodo={handleEditTodo}
              displayError={displayError}
              isDeleted
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
