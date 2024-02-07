import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
	filteredTodosList: any,
	activeFilter: string,
	tempTodo: Todo[],
	handleClearCompleted: () => void,
	handleFilterChange: (filter: string) => void,
}

export const Footer: React.FC<Props> = ({
	filteredTodosList,
	activeFilter,
	tempTodo,
	handleClearCompleted,
	handleFilterChange,
}) => {
	return (
		<footer className="todoapp__footer" data-cy="Footer">
			<span className="todo-count" data-cy="TodosCounter">
			  {`${filteredTodosList.length} items left`}
			</span>

			<nav className="filter" data-cy="Filter">
				<a
					href="#/"
					className={cn('filter__link', {
						selected: activeFilter === 'all',
					})}
					data-cy="FilterLinkAll"
					onClick={() => handleFilterChange('all')}
				>
					All
				</a>

				<a
					href="#/active"
					className={cn('filter__link', {
						selected: activeFilter === 'active',
					})}
					data-cy="FilterLinkActive"
					onClick={() => handleFilterChange('active')}
				>
					Active
				</a>

				<a
					href="#/completed"
					className={cn('filter__link', {
						selected: activeFilter === 'completed',
					})}
					data-cy="FilterLinkCompleted"
					onClick={() => handleFilterChange('completed')}
				>
					Completed
				</a>
			</nav>

			{tempTodo.filter(todo => todo.completed).length > 0 && (
				<button
					type="button"
					className="todoapp__clear-completed"
					data-cy="ClearCompletedButton"
					onClick={handleClearCompleted}
				>
					Clear completed
				</button>
			)}
		</footer>
	)
}