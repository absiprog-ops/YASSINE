import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// AI Wall Detection Endpoint using Gemini 2.5 Vision
app.post("/api/detect-walls", async (req, res) => {
  try {
    const { imageUrl, roomType } = req.body;

    if (process.env.GEMINI_API_KEY && ai) {
      const prompt = `You are an architectural computer vision AI specialized in 3D interior wall detection and polygon segmentation.
Analyze the room image for room type: "${roomType || 'SALON'}".
Please detect and segment the primary architectural walls in 100x100 normalized coordinate space:
1. "MAIN_ACCENT" (Main decorative back accent wall)
2. "SIDE_LEFT" (Left wall)
3. "SIDE_RIGHT" (Right wall)
4. "CEILING" (Ceiling and top cornices)
5. "BACK_WINDOW" (Back wall / window)

Return ONLY valid JSON array with objects matching this exact format without any markdown code formatting:
[
  {
    "wallPosition": "MAIN_ACCENT",
    "labelAr": "الجدار الرئيسي للديكور",
    "points": [{"x": 18, "y": 18}, {"x": 82, "y": 18}, {"x": 82, "y": 80}, {"x": 18, "y": 80}]
  },
  {
    "wallPosition": "SIDE_LEFT",
    "labelAr": "الجدار الأيسر",
    "points": [{"x": 0, "y": 0}, {"x": 18, "y": 18}, {"x": 18, "y": 80}, {"x": 0, "y": 100}]
  },
  {
    "wallPosition": "SIDE_RIGHT",
    "labelAr": "الجدار الأيمن",
    "points": [{"x": 82, "y": 18}, {"x": 100, "y": 0}, {"x": 100, "y": 100}, {"x": 82, "y": 80}]
  },
  {
    "wallPosition": "CEILING",
    "labelAr": "السقف والديكور الجبسي",
    "points": [{"x": 0, "y": 0}, {"x": 100, "y": 0}, {"x": 82, "y": 18}, {"x": 18, "y": 18}]
  }
]`;

      let contents: any[] = [];
      if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
        const matches = imageUrl.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
          contents = [
            {
              role: "user",
              parts: [
                { inlineData: { mimeType: matches[1], data: matches[2] } },
                { text: prompt },
              ],
            },
          ];
        } else {
          contents = [{ role: "user", parts: [{ text: `${prompt}\nImage URL: ${imageUrl}` }] }];
        }
      } else {
        contents = [{ role: "user", parts: [{ text: `${prompt}\nImage URL: ${imageUrl || ''}` }] }];
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      const text = response.text?.trim() || "";
      const cleanedJson = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      const detectedPolygons = JSON.parse(cleanedJson);

      if (Array.isArray(detectedPolygons) && detectedPolygons.length > 0) {
        return res.json({ success: true, polygons: detectedPolygons });
      }
    }
  } catch (error) {
    console.error("AI Wall Detection Error:", error);
  }

  // Fallback architectural perspective wall detection
  const fallbackPolygons = [
    {
      wallPosition: "MAIN_ACCENT",
      labelAr: "الجدار الرئيسي للديكور",
      labelFr: "Mur Principal Accent",
      points: [
        { x: 18, y: 18 },
        { x: 82, y: 18 },
        { x: 82, y: 80 },
        { x: 18, y: 80 },
      ],
    },
    {
      wallPosition: "SIDE_LEFT",
      labelAr: "الجدار الأيسر",
      labelFr: "Mur Gauche",
      points: [
        { x: 0, y: 0 },
        { x: 18, y: 18 },
        { x: 18, y: 80 },
        { x: 0, y: 100 },
      ],
    },
    {
      wallPosition: "SIDE_RIGHT",
      labelAr: "الجدار الأيمن",
      labelFr: "Mur Droit",
      points: [
        { x: 82, y: 18 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 82, y: 80 },
      ],
    },
    {
      wallPosition: "CEILING",
      labelAr: "السقف والديكور الجبسي",
      labelFr: "Plafond & Corniche",
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 82, y: 18 },
        { x: 18, y: 18 },
      ],
    },
  ];

  return res.json({ success: true, polygons: fallbackPolygons, fallback: true });
});

// AI Advisor Route for Real Estate & Interior Paint consultation
app.post("/api/ai-advisor", async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!process.env.GEMINI_API_KEY || !ai) {
      return res.json({
        reply: "مرحباً بك! أنا مستشار إقامة Magha immobilier R+2. يسعدني مساعدتك في اختيار الشقة المناسبة أو تحديد أنسب أنواع الدهانات (خيال، عنبرة، صباغة زيتية) لغرفتك. يسعدنا تواصلك معنا مباشرة عبر الواتساب أو الهاتف لمزيد من التسهيلات.",
      });
    }

    const systemInstruction = `
أنت مستشار عقاري وديكور محترف متخصص في مشروع "إقامة Magha immobilier R+2" الشقق الفاخرة ذات الواجهة الخضراء الباردة والبيضاء.
تساعد الزبناء في اختيار الشقة المناسبة حسب ميزانيتهم وعدد أفراد الأسرة، وكذلك تقديم نصائح احترافية حول أنواع الصباغة والدهانات:
- صباغة "خيال" (Khayal): تمتاز بلمسة مخملية براقة وانعكاسات ضوئية راقية، ممتازة لصالونات الضيوف والغرف الرئيسية.
- صباغة "العنبرة" (Ambra): تعطي مظهر الرخام الفاخر واللمعان المصقول، مناسبة للصالات والمداخل.
- الصباغة الزيتية / الساتيني (Oil / Satin Paint): قابلة للغسل ومقاومة للرطوبة، ممتازة للمطابخ والممرات وغرف الأطفال.

تحدث بأسلوب راقٍ، ودي، ومحترف باللغة العربية (أو الدارجة المغربية المعاصرة إذا طلب الزبون).
سياق الشقق المتاحة: ${JSON.stringify(context || {})}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nسؤال الزبون: ${prompt}` }],
        },
      ],
    });

    const reply = response.text || "أعتذر، حدث تعثر بسيط في استرجاع الإجابة. يمكنك طرح سؤالك مرة أخرى أو الاستفسار عن الشقق المتاحة.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("AI Advisor Error:", error);
    return res.json({
      reply: "مرحباً بك في إقامة Magha immobilier R+2. أهلاً بك للاستفسار عن أسعار الشقق أو تشكيلة دهانات خيال والعنبرة والصباغة الزيتية.",
    });
  }
});

// Vite middleware in dev, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
