import express from "express";
import * as dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { ollamaController } from "./controllers/ollamaController";
import { supportController } from "./controllers/supportController";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Limitar solicitudes
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: { error: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});
app.use(limiter);

// Rutas
app.post("/api/generate", ollamaController.generate);
app.post("/api/stream", ollamaController.stream);
app.post("/api/support", supportController.support);

// Iniciar el servidor
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
