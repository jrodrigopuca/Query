import { Response } from "express";
import { AxiosError } from "axios";
import { ApiError } from "../types";

export const handleError = (res: Response, error: unknown): void => {
	let apiError: ApiError;

	if (error instanceof AxiosError) {
		apiError = {
			status: error.response?.status || 500,
			message: error.response?.data?.error || "Error al conectar con Ollama",
			details: error.message,
		};
	} else if (error instanceof Error) {
		apiError = {
			status: 500,
			message: "Error interno del servidor",
			details: error.message,
		};
	} else {
		apiError = {
			status: 500,
			message: "Error desconocido",
			details: String(error),
		};
	}

	console.error(`[${apiError.status}] ${apiError.message}:`, apiError.details);
	res.status(apiError.status).json({
		error: apiError.message,
		...(apiError.details && { details: apiError.details }),
	});
};
