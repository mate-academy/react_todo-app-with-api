import { FC } from 'react';
import { Todo } from 'types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './todoTransition.css';
import { TodoItem } from 'components/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isTempTodoCreating: boolean;
  handleDelete: (id: number) => Promise<void>;
  deletingTodoIds: number[];
  isLoading: boolean;
  toggleTodo?: (todo: Todo) => Promise<void>;
  renameTodo?: (todo: Todo) => Promise<void>;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  isTempTodoCreating,
  handleDelete,
  deletingTodoIds,
  isLoading,
  toggleTodo,
  renameTodo,
}: Props) => {
  const createToggleHandler = (todo: Todo) => {
    return async () => {
      if (toggleTodo) {
        await toggleTodo(todo);
      } else {
        return Promise.resolve();
      }
    };
  };

  const renameTodoHandler = (todo: Todo) => {
    return async (newTitle: string) => {
      if (renameTodo) {
        await renameTodo({ ...todo, title: newTitle });
      } else {
        return Promise.resolve();
      }
    };
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos?.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoading={isLoading}
              handleDelete={() => handleDelete(todo.id)}
              isDeleting={deletingTodoIds.includes(todo.id)}
              onToggle={createToggleHandler(todo)}
              onRename={renameTodoHandler(todo)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              key="temp"
              todo={tempTodo}
              isLoading={isTempTodoCreating}
              isDeleting={deletingTodoIds.includes(tempTodo.id)}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
