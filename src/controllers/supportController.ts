import { Request, Response, RequestHandler } from "express";
import { ollamaService } from "../services/ollamaService";
import { handleError } from "../utils/errorHandler";
import { SupportRequestBody } from "../types";
import { supportKnowledgeBase } from "../knowledge/supportData";

export class SupportController {
	support: RequestHandler = async (
		req: Request<{}, any, SupportRequestBody>,
		res: Response
	) => {
		try {
			const { query, model } = req.body;

			if (!query) {
				res.status(400).json({ error: 'El campo "query" es obligatorio' });
				return;
			}

			// Buscar en la base de conocimiento
			const queryWords = query.toLowerCase().split(/\s+/);
			const matchingEntry = supportKnowledgeBase.entries.find((entry) =>
				entry.keywords.some((keyword) =>
					queryWords.includes(keyword.toLowerCase())
				)
			);

			let context = matchingEntry
				? matchingEntry.content
				: supportKnowledgeBase.genericResponse;
			const isOutOfScope = !matchingEntry;

			// Si está fuera del ámbito, forzamos la respuesta genérica
			if (isOutOfScope && supportKnowledgeBase.domain === "soporte técnico") {
				context = supportKnowledgeBase.genericResponse;
			}

			// Generar respuesta con Ollama usando el contexto encontrado
			const response = await ollamaService.generateSupportResponse(
				query,
				context,
				model
			);

			res.json({
				response,
				domain: supportKnowledgeBase.domain,
				inScope: !isOutOfScope,
			});
		} catch (error) {
			handleError(res, error);
		}
	};
}

export const supportController = new SupportController();
