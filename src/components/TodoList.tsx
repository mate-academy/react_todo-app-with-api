import cn from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, deleteTodo, patchTodo } from '../api/todos';
import { SetErrorContext } from '../utils/setErrorContext';
import { ErrorMessage } from '../utils/ErrorMessage';

interface Props {
  todos: Todo[],
  filteringMode: string,
  userId: number,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  todosToBeEdited: Todo['id'][] | null,
  setTodosToBeEdited: React.Dispatch<React.SetStateAction<number[] | null>>,
}

let filteredTodos: Todo[] | null = [];

export const TodoList: React.FC<Props> = ({
  todos, filteringMode, userId, setTodos, todosToBeEdited, setTodosToBeEdited,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [processing, setProcessing] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  if (filteringMode !== 'all' && todos !== null) {
    switch (filteringMode) {
      case 'active':
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
    }
  } else {
    filteredTodos = todos;
  }

  const setError = useContext(SetErrorContext);

  const handleSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      if (todoTitle) {
        setProcessing(true);
        setTempTodo({
          title: todoTitle,
          completed: false,
          userId,
          id: 0,
        });
        addTodo({
          title: todoTitle,
          completed: false,
          userId,
        })
          .then((response) => {
            setProcessing(false);
            setTempTodo(null);
            todos?.push(response);
          })
          .catch(() => setError?.(ErrorMessage.CantAdd));
        // #TODO: get rid of the nasty ?. somehow

        setTodoTitle('');
      } else {
        setError?.(ErrorMessage.EmptyTitle);
        // #TODO: get rid of the nasty ?. somehow
      }
    }
  };

  const handleActiveToggle = (todo: Todo) => {
    setTodosToBeEdited([todo.id]);
    patchTodo(todo.id, { completed: !todo.completed })
      .then(() => {
        setTodosToBeEdited([]);
        const todoList = [...todos];

        const todoIndex = todoList.findIndex(arrTodo => arrTodo.id === todo.id);

        todoList[todoIndex] = {
          id: todo.id,
          userId: todo.userId,
          title: todo.title,
          completed: !todo.completed,
        };

        setTodos(todoList);
      })
      .catch(() => {
        setError?.(ErrorMessage.CantUpdate);
        setTodosToBeEdited([]);
      });
  };

  const handleMassActiveToggle = () => {
    if (!todos.find(todo => !todo.completed)) {
      console.log('clokc');
      setTodosToBeEdited(todos.map(todo => todo.id));
      Promise.all(todos.map((todo) => {
        return new Promise(
          (resolve) => patchTodo(todo.id, { completed: !todo.completed })
            .then(resolve),
        )
          .catch(() => {
            setTodosToBeEdited([]);
            setError?.(ErrorMessage.CantUpdate);
          });
      }))
        .then(() => {
          setTodosToBeEdited([]);
          setTodos(todos.map(todo => {
            return {
              title: todo.title,
              id: todo.id,
              userId: todo.userId,
              completed: !todo.completed,
            };
          }));
        });
    } else {
      const unfinishedTodos = todos.filter(todo => !todo.completed);

      setTodosToBeEdited(unfinishedTodos.map(todo => todo.id));
      Promise.all(unfinishedTodos.map((todo) => {
        return new Promise(
          (resolve) => patchTodo(todo.id, { completed: !todo.completed })
            .then(resolve),
        )
          .catch(() => {
            setTodosToBeEdited([]);
            setError?.(ErrorMessage.CantUpdate);
          });
      }))
        .then(() => {
          setTodosToBeEdited([]);
          setTodos(todos.map(todo => {
            return {
              title: todo.title,
              id: todo.id,
              userId: todo.userId,
              completed: true,
            };
          }));
        });
    }
  };

  const handleDeletion = (todoId: number) => {
    if (todos) {
      setTodosToBeEdited([todoId]);
      deleteTodo(todoId)
        .then(() => {
          const deletedId = todos?.findIndex(todo => todo.id === todoId);
          const splicedTodos = [...todos];

          splicedTodos?.splice(deletedId, 1);
          setTodos(splicedTodos);
          setTodosToBeEdited(null);
        })
        .catch(() => {
          setTodosToBeEdited(null);
          setError?.(ErrorMessage.CantDelete);
        });
    }
  };

  return (
    <>
      <header className="todoapp__header">
        {/* this buttons is active only if there are some active todos */}
        <button
          type="button"
          className={cn({
            'todoapp__toggle-all': true,
            active: !todos.find(todo => !todo.completed),
          })}
          aria-label="Toggle all"
          onClick={handleMassActiveToggle}
        />

        <form>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={(event) => setTodoTitle(event.target.value)}
            onKeyDown={handleSubmit}
            disabled={processing}
          />
        </form>
      </header>

      <section className="todoapp__main">
        {filteredTodos?.map(todo => (
          <div
            className={cn({
              todo: true,
              completed: todo.completed,
            })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                defaultChecked={todo.completed}
                onClick={() => handleActiveToggle(todo)}
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeletion(todo.id)}
            >
              ×
            </button>

            <div className={
              todosToBeEdited?.includes(todo.id)
                ? 'modal overlay is-active'
                : 'modal overlay'
            }
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

        {tempTodo
        && (
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {/* This todo is being edited */}
        {/* <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div> */}

        {/* This todo is in loadind state */}

      </section>
    </>
  );
};
