import { Request, Response, RequestHandler } from "express";
import { ollamaService } from "../services/ollamaService";
import { handleError } from "../utils/errorHandler";
import { GenerateRequestBody } from "../types";

export class OllamaController {
	generate: RequestHandler = async (
		req: Request<{}, any, GenerateRequestBody>,
		res: Response
	) => {
		try {
			const { prompt, model } = req.body;
			if (!prompt) {
				res.status(400).json({ error: 'El campo "prompt" es obligatorio' });
				return;
			}

			const response = await ollamaService.generateResponse({ prompt, model });
			res.json({ response });
		} catch (error) {
			handleError(res, error);
		}
	};

	stream: RequestHandler = async (
		req: Request<{}, any, GenerateRequestBody>,
		res: Response
	) => {
		try {
			const { prompt, model } = req.body;
			if (!prompt) {
				res.status(400).json({ error: 'El campo "prompt" es obligatorio' });
				return;
			}

			// Configurar Server-Sent Events
			res.setHeader("Content-Type", "text/event-stream");
			res.setHeader("Cache-Control", "no-cache");
			res.setHeader("Connection", "keep-alive");
			res.flushHeaders();

			const stream = await ollamaService.generateStream({ prompt, model });

			stream.on("data", (chunk: Buffer) => {
				const lines = chunk.toString().split("\n").filter(Boolean);
				for (const line of lines) {
					try {
						const parsed = JSON.parse(line);
						const data = parsed.response || "";
						res.write(`data: ${JSON.stringify({ response: data })}\n\n`);
					} catch (parseError) {
						console.warn("Error al parsear chunk:", parseError);
					}
				}
			});

			stream.on("end", () => {
				res.write("data: [DONE]\n\n");
				res.end();
			});

			stream.on("error", (streamError) => {
				handleError(res, streamError);
				res.end();
			});

			req.on("close", () => {
				stream.destroy();
				res.end();
			});
		} catch (error) {
			handleError(res, error);
		}
	};
}

export const ollamaController = new OllamaController();
