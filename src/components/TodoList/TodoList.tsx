import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TempTodoInfo } from '../TempTodoInfo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo [],
  tempTodo: Todo | null,
  processingTodosIds: number[],
  onTodoDeletion: (id: number) => void,
  onStatusChange: (id: number, completed: boolean) => void,
  updateTitle: (id:number, title: string) => void,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  processingTodosIds,
  onTodoDeletion,
  onStatusChange,
  updateTitle,
}) => {
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
              todo={todo}
              key={todo.id}
              deleteTodoById={onTodoDeletion}
              changeStatus={onStatusChange}
              updateTitle={updateTitle}
              isProcessing={processingTodosIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodoInfo tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
