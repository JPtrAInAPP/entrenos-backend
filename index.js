require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log("⚠ El servidor ha arrancado");

app.use(cors({
  origin: ['https://trainapp-b0e74.web.app', 'https://trainapp.firebaseapp.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));


app.use(express.json());

// Inicializa Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Función para extraer JSON válido de texto recibido
function extraerJSON(texto) {
  const jsonStart = texto.indexOf('{');
  const jsonEnd = texto.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const posibleJSON = texto.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(posibleJSON);
  } else {
    throw new Error("No se encontró un JSON válido en la respuesta");
  }
}

// Ruta para el formulario manual
app.post('/generar-entrenamiento', async (req, res) => {
  const datosUsuario = req.body;

  const prompt = `
Eres un entrenador experto en deportes de resistencia (ciclismo, running y natación), con nivel 3 de formación y amplia experiencia.
Vas a generar un plan de entrenamiento personalizado de 4 semanas (cada semana con 7 días), basado en los siguientes datos del usuario:

Datos personales:
- Nombre: ${datosUsuario.nombre}
- Edad: ${datosUsuario.edad}
- Sexo: ${datosUsuario.sexo}
- Empleo: ${datosUsuario.empleo || 'no especificado'}
- Correo electrónico: ${datosUsuario.email}

Deporte y nivel:
- Deporte principal: ${datosUsuario.deportePrincipal}
- Nivel: ${datosUsuario.nivel}
- Tiempo practicando este deporte: ${datosUsuario.experienciaTiempo}
- Frecuencia actual de entrenamiento: ${datosUsuario.frecuenciaActual || 'no especificada'}
- ¿Ha seguido antes un plan?: ${datosUsuario.planPrevio}

Objetivo del entrenamiento:
- Objetivo principal: ${datosUsuario.objetivo}

Disponibilidad y preferencias:
- Días disponibles por semana: ${datosUsuario.diasSemana}
- Días preferidos: ${datosUsuario.diasPreferidos}
- Tiempo disponible por sesión: ${datosUsuario.tiempoSesion}
- Hora preferida para entrenar: ${datosUsuario.horaPreferida}

Estado físico:
- Lesiones: ${datosUsuario.lesiones || 'ninguna'}
- VO2máx: ${datosUsuario.vo2max || 'no especificado'}

Tecnología y recursos:
- Dispositivos disponibles: ${datosUsuario.dispositivos || 'ninguno'}
- Plataformas de entrenamiento que usa: ${datosUsuario.plataformas || 'ninguna'}

Utiliza toda esta información para generar un plan de entrenamiento detallado que incluya:
- Días de series, trabajos de fuerza general y específica,
- Días de rodajes o sesiones regenerativas,
- Días de descanso activo o completo,
- Adaptación a horarios y disponibilidad,
- Periodización progresiva para evitar sobreentrenamiento,
- Explicaciones claras y realistas en cada día de entrenamiento.

Devuelve el plan en formato JSON con esta estructura estricta, sin texto adicional:

{
  "plan": {
    "semana1": {"1": "...", "2": "...", "3": "...", "4": "...", "5": "...", "6": "...", "7": "..."},
    "semana2": {"1": "...", "2": "...", "3": "...", "4": "...", "5": "...", "6": "...", "7": "..."},
    "semana3": {"1": "...", "2": "...", "3": "...", "4": "...", "5": "...", "6": "...", "7": "..."},
    "semana4": {"1": "...", "2": "...", "3": "...", "4": "...", "5": "...", "6": "...", "7": "..."}
  }
}
`;


  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoGenerado = response.text();

    let planJSON;
    try {
      planJSON = extraerJSON(textoGenerado);
    } catch (e) {
      console.error("Error parseando JSON de Gemini:", e);
      planJSON = { error: "No se pudo parsear el plan JSON" };
    }

    res.json({ plan: planJSON });
  } catch (error) {
    console.error("Error al generar entrenamiento:", error);
    res.status(500).send("Error generando entrenamiento");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en el puerto ${PORT}`);
});
function actualizarCalendario(nuevaSemanaHTML) {
  const calendario = document.querySelector('.calendario-mes');

  // Añade fade-out
  calendario.classList.add('fade-out');

  setTimeout(() => {
    calendario.innerHTML = nuevaSemanaHTML;

    // Quita fade-out y añade fade-in
    calendario.classList.remove('fade-out');
    calendario.classList.add('fade-in');

    // Opcional: quitar fade-in después para futuras transiciones
    setTimeout(() => {
      calendario.classList.remove('fade-in');
    }, 300);
  }, 300);
}
