<script>
	let btnText = "Generate Image";
	let promptText = "A melting clock in the style of Dali.";
	let btnDisabled = false;
	let imgURL = "";

	const makeImage = () => {
		console.log("Querying:", promptText);
		btnDisabled = true;
		btnText = "Painting...";
		makeRequest(promptText);
	};

	async function makeRequest(p) {
		const url = "https://api.openai.com/v1/images/generations";
		const bodyData = {
			model: "dall-e-2",
			// model: "dall-e-3",
			prompt: p,
			n: 1,
			size: "256x256",
			// size: "1024x1024"
		};
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${OPENAI_API_KEY}`,
				},
				body: JSON.stringify(bodyData),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const result = await response.json();
			console.log(result.data[0]);
			imgURL = result.data[0].url;
		} catch (error) {
			console.error("Failed to fetch image:", error);
		}
	}
</script>

<main>
	<h1>Salvador</h1>
	<p>
		A custom frontend for <a href="https://openai.com/index/dall-e-3/"
			>OpenAI's DALLE 3</a
		>
	</p>
	<div class="modelParams">
		<label for="prompt">Prompt</label>
		<textarea id="prompt" rows="3" cols="40" wrap="soft" bind:value={promptText}
		></textarea>
		<button on:click={makeImage} disabled={btnDisabled}>{btnText}</button>
	</div>
	<div class="results">
		{#if imgURL !== ""}
			<img src={imgURL} alt="result" />
		{/if}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 0.5em;
		max-width: 600px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 3em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
