'use client';

import { NotificationDocument } from "@/types/notification.type";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";

const Home = () => {
	const [lastRequested, setLastRequested] = useState<Date>();
	const [error, setError] = useState<string>('');

	const [notifications, setNotifications] = useState<NotificationDocument[]>([]);
	const [redis, setRedis] = useState<{ key: string; value: string; }>();
	const [job, setJob] = useState<string>('');
	const [telegram, setTelegram] = useState<string>('');

	useEffect(() => {
		const fetchNotifications = async () => {
			api.get('notifications').then((response) => {
				setNotifications(response.data);
			}).catch(error => setError(error));
		};
		fetchNotifications();
	}, []);

	const createNotification = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const notification = {
			text: formData.get('text')
		};

		await api.post('/notifications', notification).then((response) => {
			setNotifications(prev => [...prev, response.data]);
		}).catch((error) => {
			setError(error);
		});
	};

	const createRedis = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const object = {
			key: formData.get('key'),
			value: formData.get('value')
		};

		await api.post('/redis', object).then((response) => {
			setRedis(response.data);
		}).catch((error) => {
			setError(error);
		});
	};

	const getRedis = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const key = formData.get('key');

		await api.get(`/redis/${key}`).then((response) => {
			setRedis(response.data);
		}).catch((error) => {
			setError(error);
		});
	};

	const createJob = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		await api.post(`/queue`).then((response) => {
			setJob(`created job ${response.data}`);
		}).catch((error) => {
			setError(error);
		});
	};

	const getJob = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const id = formData.get('id');

		await api.get(`/queue/${id}`).then((response) => {
			setJob(JSON.stringify(response.data, null, 2));
		}).catch((error) => {
			setError(error);
		});
	};

	const createTelegram = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const telegramId = formData.get('telegramId');
		const message = formData.get('message');

		await api.post(`/telegram`, { telegramId, message }).catch((error) => {
			setError(error);
		});
	};

	const getTelegram = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const id = formData.get('id');

		await api.get(`/telegram`).then((response) => {
			setTelegram(JSON.stringify(response.data, null, 2));
		}).catch((error) => {
			setError(error);
		});
	};

	return (
		<main className="p-8 flex flex-col items-center gap-5">
			<div>
				<h2 className="font-bold text-lg text-center">CLIENT ENVIRONMENT</h2>
				<p><span className="font-bold">Server URL:</span> {process.env.NEXT_PUBLIC_SERVER_URL}</p>
				<p><span className="font-bold">Customize Comp:</span> {process.env.NEXT_PUBLIC_CUSTOMIZE_COMP}</p>
			</div>

			<div className="flex flex-col">
				<h2 className="font-bold text-lg text-center">SERVER CONNECTION</h2>

				<p><span className="font-bold">Last requested:</span> {lastRequested ? lastRequested.toLocaleString() : 'Never requested'}</p>
				<p><span className="font-bold">Error:</span> {error.length > 0 ? error : 'No error'}</p>
			</div>

			<form onSubmit={createNotification}>
				<h2 className="font-bold text-lg text-center">CREATE MONGODB ELEMENT</h2>
				<input type="text" name="text" placeholder="text" className="border border-black" />
				<button className="border border-black cursor-pointer">create</button>
			</form>

			<div>
				<h2 className="font-bold text-lg text-center">GET MONGODB ELEMENT</h2>
				<ul className="list-disc list-inside">
					{notifications.map((n, index) => {
						return <li key={`notification-${index}`}>{n.text}</li>;
					})}
				</ul>
			</div>

			<form onSubmit={createRedis}>
				<h2 className="font-bold text-lg text-center">CREATE REDIS KEY</h2>
				<input type="text" name="key" placeholder="key" className="border border-black" />
				<input type="text" name="value" placeholder="value" className="border border-black" />
				<button className="border border-black cursor-pointer">create</button>
			</form>

			<form onSubmit={getRedis}>
				<h2 className="font-bold text-lg text-center">GET REDIS KEY</h2>
				<input type="text" name="key" placeholder="key" className="border border-black" />
				<button className="border border-black cursor-pointer">get</button>
				{redis && <ul className="list-disc list-inside">
					<li>key: {redis.key}</li>
					<li>value: {redis.value}</li>
				</ul>}
			</form>

			<form onSubmit={createJob}>
				<h2 className="font-bold text-lg text-center">CREATE MICROSERVICE JOB</h2>
				<button className="border border-black cursor-pointer">create</button>
			</form>

			<form onSubmit={getJob}>
				<h2 className="font-bold text-lg text-center">GET MICROSERVICE JOB</h2>
				<input type="text" name="id" placeholder="id" className="border border-black" />
				<button className="border border-black cursor-pointer">get</button>
				{job.length > 0 && <p>{job}</p>}
			</form>

			<form onSubmit={createTelegram}>
				<h2 className="font-bold text-lg text-center">SEND TELEGRAM MESSAGE</h2>
				<input type="text" name="telegramId" placeholder="telegramId" className="border border-black" />
				<input type="text" name="message" placeholder="message" className="border border-black" />
				<button className="border border-black cursor-pointer">create</button>
			</form>

			<form onSubmit={getTelegram}>
				<h2 className="font-bold text-lg text-center">TELEGRAM CONNECTION TO REDIS</h2>
				<button className="border border-black cursor-pointer">get</button>
				{telegram.length > 0 && <p>{telegram}</p>}
			</form>
		</main>
	);
};

export default Home;
