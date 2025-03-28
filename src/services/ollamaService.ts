import axios, { AxiosResponse } from "axios";
import { Readable } from "stream";
import { GenerateRequestBody } from "../types";
import { supportKnowledgeBase } from "../knowledge/supportData";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const TIMEOUT = 30000;

export class OllamaService {
	async generateResponse({
		prompt,
		model = "llama3.2",
	}: GenerateRequestBody): Promise<string> {
		const response: AxiosResponse<{ response: string }> = await axios.post(
			`${OLLAMA_HOST}/api/generate`,
			{ model, prompt, stream: false },
			{
				headers: { "Content-Type": "application/json" },
				timeout: TIMEOUT,
			}
		);
		return response.data.response;
	}

	async generateStream({
		prompt,
		model = "llama3.2",
	}: GenerateRequestBody): Promise<Readable> {
		const response = await axios.post(
			`${OLLAMA_HOST}/api/generate`,
			{ model, prompt, stream: true },
			{
				responseType: "stream",
				headers: { "Content-Type": "application/json" },
				timeout: TIMEOUT,
			}
		);
		return response.data;
	}

	async generateSupportResponse(
		query: string,
		context: string,
		model = "llama3.2"
	): Promise<string> {
		const prompt = `Basándote únicamente en este contexto: "${context}", responde a la siguiente consulta: "${query}". Si no hay suficiente información en el contexto, usa una respuesta genérica como: "${supportKnowledgeBase.genericResponse}".`;
		const response: AxiosResponse<{ response: string }> = await axios.post(
			`${OLLAMA_HOST}/api/generate`,
			{ model, prompt, stream: false },
			{
				headers: { "Content-Type": "application/json" },
				timeout: TIMEOUT,
			}
		);
		return response.data.response;
	}
}

export const ollamaService = new OllamaService();
