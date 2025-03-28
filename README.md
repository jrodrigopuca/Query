curl -X POST http://localhost:3000/api/generate \
-H "Content-Type: application/json" \
-d '{"prompt": "Hola, ¿podrías explicarme que es un generic en Typescript?", "model": "llama3.2"}'

con Stream

curl -X POST http://localhost:3000/api/stream -H "Content-Type: application/json" -d '{"prompt": "Hola, ¿cuáles son las diferencias entre TypeScript y JavaScript?", "model": "llama3.2"}'

Para probar
npx tsc
node dist/index.js
