// Stage 2: get-or-create a student's personalized scenario instance.
import * as PrismaNs from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { ScenarioPayload } from "./scenario-generation";
import { deriveSeed, generatePayload } from "./scenario-generation";
import { db } from "./db";

type ScenarioTemplate = PrismaNs.ScenarioTemplate;
type ScenarioInstance = PrismaNs.ScenarioInstance;

export interface ScenarioWithPayload {
  instance: ScenarioInstance;
  payload: ScenarioPayload;
}

/**
 * Return the student's instance for a template, creating it on first access.
 * The unique (userId, templateId) pair + derived seed guarantee:
 * - same student -> same scenario (matches their previous attempts/progress)
 * - different students -> almost always different scenarios (32-bit seed space)
 */
export async function getOrCreateScenarioInstance(
  userId: string,
  template: ScenarioTemplate
): Promise<ScenarioWithPayload> {
  const seed = deriveSeed(userId, template.id);

  const instance = await db.scenarioInstance.upsert({
    where: {
      userId_templateId: { userId, templateId: template.id },
    },
    // Reasonable to regenerate above an empty payload, e.g. after generator fixes.
    update: {},
    create: {
      userId,
      templateId: template.id,
      seed,
      payload: generatePayload(
        seed,
        template.title,
        template.storyTemplate,
        template.variableSlots as { [slot: string]: string[] }
      ) as unknown as Prisma.InputJsonValue,
    },
  });

  return { instance, payload: instance.payload as unknown as ScenarioPayload };
}
