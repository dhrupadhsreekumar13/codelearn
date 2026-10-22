// Stage 2: deterministic scenario generation.
// A scenario is derived from seed = hash(userId + templateId), so the same student
// always sees the same version, but two students almost never share one.

// Matches the JSON stored in ScenarioTemplate.variableSlots: slot name -> possible values.
export type VariableSlots = { [slot: string]: string[] };

// The generated version's payload stored in ScenarioInstance.payload.
export interface ScenarioPayload {
  title: string;
  story: string; // storyTemplate with every {{slot}} replaced
  slotValues: { [slot: string]: string }; // which value each slot got
}

/** FNV-1a (32-bit): stable across runs/versions, returns an unsigned int seed. */
export function deriveSeed(userId: string, templateId: string): number {
  const input = `${userId}:${templateId}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Mulberry32: small, fast PRNG that is deterministic for a given seed. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fill the template's slots with random picks and substitute them into the story.
 * Uses the scenario's seed (derived from userId + templateId) so each user gets
 * their own stable version. Throws if the template has a {{slot}} with no matching
 * entry in variableSlots, so empty-broken scenarios can never be generated silently.
 */
export function generatePayload(
  seed: number,
  title: string,
  storyTemplate: string,
  variableSlots: VariableSlots
): ScenarioPayload {
  const rng = makeRng(seed);
  const slotValues: { [slot: string]: string } = {};

  const story = storyTemplate.replace(/\{\{(\w+)\}\}/g, (_match, slot: string) => {
    const options = variableSlots[slot];
    if (!options || options.length === 0) {
      throw new Error(`variableSlots has no values for slot "${slot}"`);
    }
    const value = options[Math.floor(rng() * options.length)];
    slotValues[slot] = value;
    return value;
  });

  return { title, story, slotValues };
}
