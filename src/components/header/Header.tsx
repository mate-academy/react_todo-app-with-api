/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Title {
  title : string;
}

interface Completed {
  completed: boolean;
}

type Props = {
  setTodoList:(todo: Todo[]) => void,
  todoList: Todo[],
  setError:(text: string) => void,
  addTodoToProcesing:(id: number | null) => void,
  editTodo:(id: number, itemToEdit: Title | Completed) => void
};

export const Header:React.FC<Props> = ({
  setTodoList,
  todoList,
  setError,
  editTodo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [allActiveButton, setAllActiveButton] = useState(false);
  const todoForProcessing = {
    title: inputValue,
    completed: false,
    userId: 10514,
    id: 0,
  };

  useEffect(() => setAllActiveButton(
    todoList.some(item => !item.completed),
  ), [todoList]);

  const onAddTodo = (key: string, id: number, todoTitle: string) => {
    if (key === 'Enter') {
      if (!inputValue.trim()) {
        setError(ErrorMessage.Title);

        return;
      }

      setTodoList([...todoList, todoForProcessing]);

      postTodo(id, todoTitle.trim())
        .then(newTodo => {
          setTodoList(todoList.filter(todo => todo.id));
          setTodoList([...todoList, newTodo]);
          setInputValue('');
        })
        .catch(() => {
          setTodoList(todoList.filter(todo => todo.id));
          setError(ErrorMessage.Post);
        });
    }
  };

  const onAllCompleated = () => {
    todoList.forEach(todo => {
      if (todo.completed !== allActiveButton) {
        editTodo(todo.id, { completed: allActiveButton });
      }
    });
  };

  return (
    <header className="todoapp__header">
      {todoList.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: !allActiveButton })}
          onClick={onAllCompleated}
        />
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => onAddTodo(e.key, 10514, inputValue)}
        />
      </form>
    </header>
  );
};
