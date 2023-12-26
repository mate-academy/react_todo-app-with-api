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
  setLoadingTodoId: (loadingTodoId: number[]) => void,
  handleEditTodo: (todoId: number, newTitle: string) => void,
}

export const TodoList: FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    deleteTodo,
    loadingTodoId,
    updateTodo,
    setLoadingTodoId,
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
              loading={loadingTodoId.includes(todo.id)}
              updateTodo={updateTodo}
              setLoadingTodoId={setLoadingTodoId}
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
              loading={loadingTodoId.includes(tempTodo.id)}
              deleteTodo={deleteTodo}
              isTemporary
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
