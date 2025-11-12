/* eslint-disable jsx-a11y/label-has-associated-control */
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../Todo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: Todo['id'][];
  changedTodo: Todo | null;
  todoTitleToChange: string;
  onTodoTitleToChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangedTodo: (todo: Todo) => void;
  onLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>;
  onHandleDeleteTodo: (todoId: Todo['id']) => void;
  onToggleStatus: (todo: Todo) => void;
  onSubmitTitle: (
    event: React.FormEvent<HTMLFormElement>,
    updatedTodo: Todo,
  ) => void;
  onHandleTitleChange: (updatedTodo: Todo | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodos,
  onHandleDeleteTodo,
  onToggleStatus,
  changedTodo,
  onChangedTodo,
  todoTitleToChange,
  onTodoTitleToChange,
  onSubmitTitle,
  onHandleTitleChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoInfo
              key={todo.id}
              todo={todo}
              loadingTodos={loadingTodos}
              changedTodo={changedTodo}
              onChangedTodo={onChangedTodo}
              todoTitleToChange={todoTitleToChange}
              onTodoTitleToChange={onTodoTitleToChange}
              onHandleDeleteTodo={onHandleDeleteTodo}
              onToggleStatus={onToggleStatus}
              onSubmitTitle={onSubmitTitle}
              onHandleTitleChange={onHandleTitleChange}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoInfo
              key={tempTodo.id}
              todo={tempTodo}
              loadingTodos={loadingTodos}
              changedTodo={changedTodo}
              onChangedTodo={onChangedTodo}
              todoTitleToChange={todoTitleToChange}
              onTodoTitleToChange={onTodoTitleToChange}
              onHandleDeleteTodo={onHandleDeleteTodo}
              onToggleStatus={onToggleStatus}
              onSubmitTitle={onSubmitTitle}
              onHandleTitleChange={onHandleTitleChange}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
