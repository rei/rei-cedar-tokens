import Ajv from "ajv";
import { readFileSync } from "fs";
import { globSync } from "glob";
import path from "path";

const schema = JSON.parse(
  readFileSync(
    path.resolve(process.cwd(), "schema/token.schema.json"),
    "utf-8",
  ),
);

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

export function validateTokenSchema(tokenGlob = "tokens/global/*.json"): void {
  const files = globSync(tokenGlob);

  // Exclude _options files — they use an 'options' root wrapper
  // and deprecated files — they use a 'deprecated-*' root wrapper.
  // Both are intentionally sparse and do not require docs on every token.
  const targetFiles = files.filter(
    (f) => !path.basename(f).startsWith("deprecated-"),
  );

  const errors: string[] = [];

  for (const file of targetFiles) {
    const data = JSON.parse(readFileSync(file, "utf-8"));

    if (!validate(data)) {
      const fileErrors = (validate.errors ?? [])
        // Filter out AJV meta-errors from if/then/else branching — these
        // are noise. Only surface errors that point to actual token fields.
        .filter((e) => !["if", "then", "else"].includes(e.keyword))
        .map((e) => `    ${e.instancePath || "(root)"}: ${e.message}`);

      if (fileErrors.length > 0) {
        errors.push(`\n  ✕ ${file}\n${fileErrors.join("\n")}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("\n[Cedar] Schema validation failed:");
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log(`[Cedar] ✓ Schema validated ${targetFiles.length} token files`);
}
