import { syllogismStages } from "./constants";
import { validateConfigAndGenerateSyllogism } from "./syllogism";

const stage = syllogismStages.stage1;
if (stage) {
  const result = validateConfigAndGenerateSyllogism(stage);
  console.log(JSON.stringify(result, null, 2));
} else {
  console.error("Stage configuration is undefined");
}
