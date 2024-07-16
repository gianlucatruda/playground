import { OPENAI_API_KEY } from "$env/static/private";
import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const url = "https://api.openai.com/v1/images/generations";
	const bodyData = await request.json(); // Convert stream to JSON
	console.log("Ready to make OpenAI request", { bodyData });

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		},
		body: JSON.stringify(bodyData),
	});

	const result = await response.json();
	return json(result);

}

