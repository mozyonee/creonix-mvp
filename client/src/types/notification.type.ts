export interface Notification {
	text: string;
}

export interface NotificationDocument extends Notification {
	_id: string;
	createdAt?: Date;
	updatedAt?: Date;
}