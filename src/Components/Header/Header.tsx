import classNames from 'classnames';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/UserID';
import { Errors } from '../../utils/enum';

type Props = {
  todos: Todo[];
  setTodoList: (todos: Todo[]) => void;
  title: string;
  handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setTitleTodo: (value: string) => void;
  setErrorMessage: (errorMessage: string) => void;
  setTempTodo: (value: Todo | null) => void;
  activeInput: boolean;
  setActiveInput: (value: boolean) => void;
  handleChangeStatusAllTodos: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodoList,
  title,
  handleChangeTitle,
  setTitleTodo,
  setErrorMessage,
  setTempTodo,
  activeInput,
  setActiveInput,
  handleChangeStatusAllTodos,
}) => {
  const handleAddNewTodo = async (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage(Errors.Empty);

      return;
    }

    try {
      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
      };

      setActiveInput(false);
      setTempTodo({ ...newTodo, id: 0 });

      const response = await addTodo(newTodo);

      setTodoList([...todos, response]);

      setTitleTodo('');
    } catch {
      setErrorMessage(Errors.Add);
    } finally {
      setActiveInput(true);
      setTempTodo(null);
    }
  };

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="button"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          onClick={handleChangeStatusAllTodos}
        />
      )}

      <form onSubmit={handleAddNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
          disabled={!activeInput}
        />
      </form>
    </header>
  );
};
