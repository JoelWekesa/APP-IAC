'use client';
import {Todo} from '@/models/todo';
import useTodos from '@/services/get-todos';
import {Loader2, Pen, Trash2} from 'lucide-react';
import {FC, useEffect, useState} from 'react';
import Loading from '../shared/loading';
import {Button} from '../ui/button';
import {Card, CardFooter, CardHeader, CardTitle} from '../ui/card';
import {Checkbox} from '../ui/checkbox';
import useUpdateTodo from '@/services/update';
import useDeleteTodo from '@/services/delete-todo';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {baseURL, validationSchema} from './add-todo';
import {z} from 'zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {DialogClose} from '@radix-ui/react-dialog';
import useTodo from '@/services/get-todo';

const ListTodos: FC<{token: string}> = ({token}) => {
	const {data: todos = [], isLoading} = useTodos({token});

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div>
			{todos.map((todo) => (
				<div className='py-1' key={todo.id}>
					<TodoComponent todo={todo} token={token} />
				</div>
			))}
		</div>
	);
};

const TodoComponent: FC<{todo: Todo; token: string}> = ({todo, token}) => {
	const {data, isLoading} = useTodo({todo, auth: {token, baseURL}});

	const [open, setOpen] = useState(false);

	const toggleOpen = () => {
		setOpen((open) => !open);
	};

	const form = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues: {title: data.title},
	});

	const [complete, setComplete] = useState(data.completed);

	const {mutate: update} = useUpdateTodo();

	const {mutate: remove, isPending: isDeleting} = useDeleteTodo();

	const toggleCheck = () => {
		update({auth: {token}, data: {title: data.title, id: data.id, completed: !complete}});
		setComplete((complete) => !complete);
	};

	const updateTodo = (data: z.infer<typeof validationSchema>) => {
		update({auth: {token}, data: {title: data.title, id: todo.id, completed: complete}});
		form.reset();
		toggleOpen();
	};

	const deleteTodo = () => {
		remove({token, id: data.id});
	};

	useEffect(() => {
		form.reset({title: data.title});
	}, [data, form]);

	return (
		<Card className='w-full p-2'>
			<CardHeader>
				<CardTitle>
					<div className='flex flex-row justify-between'>
						<span className={`${todo.completed && !isLoading && 'text-decoration: line-through'}`}>
							{isLoading ? 'Loading...' : todo.title}
						</span>
						<div className='flex items-center space-x-2'>
							<Checkbox id='todo' checked={complete} onCheckedChange={toggleCheck} />
							<label
								htmlFor='todo'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
								{todo.completed ? 'Completed' : 'Mark as complete'}
							</label>
						</div>
					</div>
				</CardTitle>
			</CardHeader>
			<CardFooter className='flex mr-auto justify-end gap-2'>
				<Dialog open={open} onOpenChange={toggleOpen}>
					<DialogTrigger asChild>
						<Button variant='outline' size='icon'>
							<Pen />
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px] w-full max-w-xs p-4 sm:p-6 rounded-lg sm:rounded-xl bg-white shadow-lg overflow-y-auto sm:max-h-[90vh]'>
						<DialogHeader>
							<DialogTitle>Edit Todo</DialogTitle>
							<DialogDescription>Update your to stay organized and track your progress.</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form className='flex flex-col gap-2 p-2' onSubmit={form.handleSubmit(updateTodo)}>
								<FormField
									control={form.control}
									name='title'
									render={({field}) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input placeholder='Enter your todo title' id='title' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<DialogFooter>
									<DialogClose asChild>
										<Button type='button' variant='secondary'>
											Cancel
										</Button>
									</DialogClose>
									<Button type='submit'>Save changes</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>

				<Button variant='destructive' size='icon' onClick={deleteTodo}>
					{isDeleting ? <Loader2 className='animate-spin' /> : <Trash2 />}
				</Button>
			</CardFooter>
		</Card>
	);
};
export default ListTodos;
