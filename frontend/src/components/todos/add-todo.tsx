'use client';

import React, {FC} from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../ui/card';
import {Button} from '../ui/button';
import useAddTodo from '@/services/add-todo';
import {Loader2} from 'lucide-react';

export const baseURL = process.env.NEXT_PUBLIC_API_URL as string;

export const validationSchema = z.object({
	title: z.string({message: 'Title is required'}).min(3, {message: 'Title must be at least 3 characters'}),
});

const AddTodo: FC<{token: string}> = ({token}) => {
	const form = useForm<z.infer<typeof validationSchema>>({
		resolver: zodResolver(validationSchema),
		defaultValues: {title: ''},
	});

	const {mutate, isPending} = useAddTodo();

	const handleSubmit = (data: z.infer<typeof validationSchema>) => {
		mutate({auth: {token}, data});
		form.reset();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Todo</CardTitle>
				<CardDescription>Add a new todo to stay organized and track your progress.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className='flex flex-col gap-2 p-2' onSubmit={form.handleSubmit(handleSubmit)}>
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

						<Button type='submit' disabled={isPending}>
							{isPending && <Loader2 className='animate-spin' />}
							Add Todo
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default AddTodo;
