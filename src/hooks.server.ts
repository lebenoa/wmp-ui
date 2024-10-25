// Only used during development
export async function handle({ event, resolve }) {
	if (
		event.url.pathname.startsWith("/api") ||
		event.url.pathname.startsWith("/temp-download") ||
		event.url.pathname.startsWith("/load-playlist") ||
		event.url.pathname.startsWith("/save-playlist") ||
		event.url.pathname.startsWith("/img") ||
		event.url.pathname.startsWith("/download") ||
		event.url.pathname.startsWith("/m") ||
		event.url.pathname.startsWith("/search") ||
		event.url.pathname.startsWith("/history") ||
		event.url.pathname.startsWith("/td")
	) {
		console.log("api request", event.url.pathname);
		const apiResponse = await fetch(`http://127.0.0.1:1809${event.url.pathname}`, {
			method: event.request.method,
			body: event.request.body,
			headers: event.request.headers,
			duplex: "half"
		});
		return apiResponse;
	}

	return await resolve(event);
}
