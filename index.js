import fs from "fs";
import {fileURLToPath} from "url";
import path from "path";
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// load the model
const modelFilename = "Phi-3-mini-4k-instruct-q4.gguf";
console.log("Loading " + modelFilename);
const model = new LlamaModel({
    modelPath: path.join(__dirname, "models", modelFilename)
});
const context = new LlamaContext({model});

// load the data
const dataFilename = "RP.json";
console.log("Loading " + dataFilename);
const data = fs.readFileSync(path.join(__dirname, "data", dataFilename));
const json = JSON.parse(data);
const systemPrompt = ""

// iterate over the data, prompt using input and consider the response as rejected
for (let i = 0; i < json.length; i++) {
	const session = new LlamaChatSession({
		context,
		systemPrompt,
	});
	console.log("Prompt " + (i + 1) + " of " + json.length);
	const q = json[i].input;
	console.log("User: " + q);

	const a = await session.prompt(q);
	console.log("AI: " + a);

	json[i].rejected = a;
}

// save the data with a new name
const newFilename = dataFilename.replace(".json", "-poo.json");
console.log("Saving to " + newFilename);
fs.writeFileSync(path.join(__dirname, "data", newFilename), JSON.stringify(json, null, 4));