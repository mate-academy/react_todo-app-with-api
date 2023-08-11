import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { removeTodo, modifyTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';
import { DeleteModalContext } from '../../context/DeleteModalContext';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  deleteTodo,
  tempTodo,
}) => {
  const { setDeleteModal } = useContext(DeleteModalContext);

  const updateTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    const { checked } = event.target;

    setDeleteModal([todo.id]);
    modifyTodo(todo.id, { ...todo, completed: checked })
      .then(() => {
        setTodos((prevState: Todo[]) => {
          return prevState.map(prevTodo => {
            if (prevTodo.id === todo.id) {
              return {
                ...todo,
                completed: checked,
              };
            }

            return prevTodo;
          });
        });
      })
      .catch(() => {
        throw new Error(ErrorType.Patch);
      })
      .finally(() => setDeleteModal([]));
  };

  const clearTodo = (todo: Todo) => {
    setDeleteModal([todo.id]);
    removeTodo(todo.id)
      .then(() => deleteTodo(todo.id))
      .catch(() => ErrorType.Delete)
      .finally(
        () => setDeleteModal([]),
      );
  };

  const editeTitle = (todo: Todo, title: string) => {
    setDeleteModal([todo.id]);

    modifyTodo(todo.id, { ...todo, title })
      .then(() => {
        setTodos((prevState: Todo[]) => {
          return prevState.map(prevTodo => {
            if (prevTodo.id === todo.id) {
              return {
                ...prevTodo,
                title,
              };
            }

            return prevTodo;
          });
        });
      })
      .catch(() => ErrorType.Patch)
      .finally(
        () => setDeleteModal([]),
      );
  };

  return (
    <ul className="todo-list">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              updateTodo={updateTodo}
              clearTodo={clearTodo}
              editeTitle={editeTitle}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={500}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              key={tempTodo.id}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
