export interface GenerateRequestBody {
	prompt: string;
	model?: string;
}

export interface SupportRequestBody {
	query: string;
	model?: string;
}

export interface ApiError {
	status: number;
	message: string;
	details?: any;
}
