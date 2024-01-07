import { FC } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../Todo';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todos: TodoType[],
  tempTodo: TodoType | null,
  deleteTodo: (todoId: number) => void,
  loadingTodoId: number[],
  updateTodo: (updatedTodo: TodoType) =>Promise<void>,
  handleEditTodo: (todoId: number, newTitle: string) => void,
}

export const TodoList: FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    deleteTodo,
    loadingTodoId,
    updateTodo,
    handleEditTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <Todo
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              isLoading={loadingTodoId.includes(todo.id)}
              updateTodo={updateTodo}
              handleEditTodo={handleEditTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <Todo
              todo={tempTodo}
              isLoading={loadingTodoId.includes(tempTodo.id)}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
