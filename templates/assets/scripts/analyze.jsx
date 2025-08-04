try {
	$.writeln('Hello world');
} catch (error) {
	$.writeln(error.toString());
} finally {
	if (app.project) {
		app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
	}
}