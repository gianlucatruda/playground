import os
import openai


def parse_query(q: str):
    parts = q.split(" ")
    command, query = parts[0], " ".join(parts[1:])
    if command.lower() not in ["/do", "/ask"]:
        return f"'{command}' is not a valid command. Try '/do' or '/ask'"
    if command.lower() == "/do":
        r = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI autocomplete tool for React.js projects. You only return valid React code.",
                },
                {"role": "user", "content": query},
            ],
        )
        return f"/DO {r.choices[0].message}"

    r = openai.Completion.create(
        engine="davinci",
        model="text-davinci-003",
        prompt=f"In one sentence, help the user with this problem in React.js: {query}",
        max_tokens=100,
        temperature=0.1,
    )
    return r["choices"][0].text.strip()


openai.api_key = os.getenv("OPENAI_API_KEY")
for i in range(10):
    q = input("> ").strip()
    print(f"USER INPUT: {q}")
    r = parse_query(q)
    print(f"AI RESPONSE: {r}")
