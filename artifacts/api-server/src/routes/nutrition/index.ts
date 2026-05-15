import { Router, type IRouter } from "express";
import { desc, sql, eq } from "drizzle-orm";
import { db, scansTable } from "@workspace/db";
import { upload } from "../../middlewares/upload";
import { analyzeFoodImage } from "../../lib/nutrition-analyzer";
import {
  GetScanByIdParams,
  DeleteScanParams,
  GetScanByIdResponse,
  GetScanHistoryResponse,
  AnalyzeFoodResponse,
  GetNutritionStatsResponse,
} from "@workspace/api-zod";
import { logger } from "../../lib/logger";

const router: IRouter = Router();

router.post("/nutrition/analyze", upload.single("image"), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No image file provided" });
    return;
  }

  const imageBase64 = req.file.buffer.toString("base64");
  const mimeType = req.file.mimetype;

  req.log.info({ mimeType, size: req.file.size }, "Analyzing food image");

  const analysis = await analyzeFoodImage(imageBase64, mimeType);

  const [scan] = await db
    .insert(scansTable)
    .values({
      foodName: analysis.foodName,
      confidence: analysis.confidence,
      servingSize: analysis.servingSize,
      calories: analysis.calories,
      protein: analysis.protein,
      carbs: analysis.carbs,
      fat: analysis.fat,
      fiber: analysis.fiber,
      sugar: analysis.sugar,
      sodium: analysis.sodium,
      cholesterol: analysis.cholesterol,
      healthScore: analysis.healthScore,
      healthSummary: analysis.healthSummary,
      vitamins: analysis.vitamins,
      minerals: analysis.minerals,
      allergens: analysis.allergens,
      dietaryFlags: analysis.dietaryFlags,
      ingredients: analysis.ingredients,
      recommendations: analysis.recommendations,
      imageUrl: `data:${mimeType};base64,${imageBase64}`,
    })
    .returning();

  req.log.info({ scanId: scan.id, foodName: scan.foodName }, "Scan saved");

  const response = AnalyzeFoodResponse.parse({
    ...scan,
    createdAt: scan.createdAt.toISOString(),
  });
  res.json(response);
});

router.get("/nutrition/history", async (req, res): Promise<void> => {
  const scans = await db
    .select()
    .from(scansTable)
    .orderBy(desc(scansTable.createdAt))
    .limit(20);

  const response = GetScanHistoryResponse.parse(
    scans.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() }))
  );
  res.json(response);
});

router.get("/nutrition/history/:id", async (req, res): Promise<void> => {
  const params = GetScanByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [scan] = await db
    .select()
    .from(scansTable)
    .where(eq(scansTable.id, params.data.id));

  if (!scan) {
    res.status(404).json({ error: "Scan not found" });
    return;
  }

  const response = GetScanByIdResponse.parse({
    ...scan,
    createdAt: scan.createdAt.toISOString(),
  });
  res.json(response);
});

router.delete("/nutrition/history/:id", async (req, res): Promise<void> => {
  const params = DeleteScanParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [scan] = await db
    .delete(scansTable)
    .where(eq(scansTable.id, params.data.id))
    .returning();

  if (!scan) {
    res.status(404).json({ error: "Scan not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/nutrition/stats", async (req, res): Promise<void> => {
  const allScans = await db.select().from(scansTable);

  if (allScans.length === 0) {
    const response = GetNutritionStatsResponse.parse({
      totalScans: 0,
      avgCalories: 0,
      avgHealthScore: 0,
      topFoods: [],
      avgMacros: { protein: 0, carbs: 0, fat: 0 },
    });
    res.json(response);
    return;
  }

  const totalScans = allScans.length;
  const avgCalories = allScans.reduce((s, r) => s + r.calories, 0) / totalScans;
  const avgHealthScore = allScans.reduce((s, r) => s + r.healthScore, 0) / totalScans;

  const foodCounts: Record<string, number> = {};
  for (const scan of allScans) {
    foodCounts[scan.foodName] = (foodCounts[scan.foodName] ?? 0) + 1;
  }
  const topFoods = Object.entries(foodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([foodName, count]) => ({ foodName, count }));

  const parseGrams = (val: string): number => {
    const n = parseFloat(val.replace(/[^\d.]/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const avgProtein = allScans.reduce((s, r) => s + parseGrams(r.protein), 0) / totalScans;
  const avgCarbs = allScans.reduce((s, r) => s + parseGrams(r.carbs), 0) / totalScans;
  const avgFat = allScans.reduce((s, r) => s + parseGrams(r.fat), 0) / totalScans;

  const response = GetNutritionStatsResponse.parse({
    totalScans,
    avgCalories: Math.round(avgCalories * 10) / 10,
    avgHealthScore: Math.round(avgHealthScore * 10) / 10,
    topFoods,
    avgMacros: {
      protein: Math.round(avgProtein * 10) / 10,
      carbs: Math.round(avgCarbs * 10) / 10,
      fat: Math.round(avgFat * 10) / 10,
    },
  });

  res.json(response);
});

export default router;
