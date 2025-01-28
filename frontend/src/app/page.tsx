import TodosComponent from '@/components/todos';
import {config} from '@/config/config';
import {cookies} from 'next/headers';

const Home = async () => {
	let token: string | undefined;

	const cookieStore = await cookies();

	token = await cookieStore.get('sil-token')?.value;

	const fetchData = async () => {
		const url = config.appURL + '/api/auth';

		try {
			const response = await fetch(url, {
				method: 'GET',
			});

			if (response.ok) {
				const data = await response.json();
				return data.token;
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (!token) {
		token = await fetchData();
	}

	return (
		<>
			<TodosComponent token={token || ''} />
		</>
	);
};

export default Home;
