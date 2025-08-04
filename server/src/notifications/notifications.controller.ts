import { Controller, Get, Post, Patch, Param, Delete, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) { }

	@Post()
	create(@Body() body: { text: string; }) {
		return this.notificationsService.create(body.text);
	}

	@Get()
	findAll() {
		return this.notificationsService.findAll();
	}
}
