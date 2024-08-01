import { syllogismStrings } from "./constants";
import {
  SyllogismType,
  EqualityType,
  SequenceType,
  SyllogismConfig,
  ComparisonType,
  Premise,
  Question,
  Syllogism,
} from "~/lib/types/syllogism_types";

type Graph = Map<string, Map<string, ComparisonType | EqualityType>>;

function getRandomString(): string {
  if (syllogismStrings.length === 0) {
    throw new Error("strings array is empty");
  }
  const randomString =
    syllogismStrings[Math.floor(Math.random() * syllogismStrings.length)];
  if (!randomString) {
    throw new Error("Failed to fetch a random string");
  }
  return randomString;
}

function generateAllQuestionIndexes(variableCount: number): [number, number][] {
  const indexes: [number, number][] = [];
  for (let i = 0; i < variableCount; i++) {
    for (let j = 0; j < variableCount; j++) {
      if (i !== j) {
        indexes.push([i, j]);
      }
    }
  }
  return indexes;
}

function determineComparisonAnswer(
  premises: Premise[],
  question: Question,
): boolean {
  const graph: Graph = new Map();

  for (const premise of premises) {
    if (!graph.has(premise.left)) graph.set(premise.left, new Map());
    if (!graph.has(premise.right)) graph.set(premise.right, new Map());
    graph
      .get(premise.left)!
      .set(premise.right, premise.relation as ComparisonType);
    graph
      .get(premise.right)!
      .set(
        premise.left,
        premise.relation === ComparisonType.MoreThan
          ? ComparisonType.LessThan
          : ComparisonType.MoreThan,
      );
  }

  const visited = new Set<string>();
  const path: ComparisonType[] = [];

  function dfs(current: string, target: string): boolean {
    if (current === target) return true;
    visited.add(current);

    const neighbors = graph.get(current);
    if (neighbors) {
      for (const [neighbor, relation] of neighbors) {
        if (!visited.has(neighbor)) {
          path.push(relation as ComparisonType);
          if (dfs(neighbor, target)) return true;
          path.pop();
        }
      }
    }

    return false;
  }

  const pathExists = dfs(question.left, question.right);

  if (!pathExists) return false;

  // Determine overall relationship
  let overallRelation = path[0];
  for (let i = 1; i < path.length; i++) {
    if (overallRelation !== path[i]) {
      overallRelation = ComparisonType.LessThan;
      break;
    }
  }

  // Compare overall relationship with question type
  return overallRelation === question.type;
}

function determineEqualityAnswer(
  premises: Premise[],
  question: Question,
): boolean {
  const graph: Graph = new Map();

  for (const premise of premises) {
    if (!graph.has(premise.left)) graph.set(premise.left, new Map());
    if (!graph.has(premise.right)) graph.set(premise.right, new Map());
    graph
      .get(premise.left)!
      .set(premise.right, premise.relation as EqualityType);
    graph
      .get(premise.right)!
      .set(premise.left, premise.relation as EqualityType);
  }

  const visited = new Set<string>();
  let overallRelation: EqualityType = EqualityType.Same;

  function dfs(current: string, target: string): boolean {
    if (current === target) return true;
    visited.add(current);

    const neighbors = graph.get(current);
    if (neighbors) {
      for (const [neighbor, relation] of neighbors) {
        if (!visited.has(neighbor)) {
          if (relation === EqualityType.Opposite) {
            overallRelation =
              overallRelation === EqualityType.Same
                ? EqualityType.Opposite
                : EqualityType.Same;
          }
          if (dfs(neighbor, target)) return true;
          if (relation === EqualityType.Opposite) {
            overallRelation =
              overallRelation === EqualityType.Same
                ? EqualityType.Opposite
                : EqualityType.Same;
          }
        }
      }
    }

    return false;
  }

  const pathExists = dfs(question.left, question.right);

  if (!pathExists) return false;

  return overallRelation === question.type;
}

function getRelationFromStructure(
  char: string,
  syllogismType: SyllogismType,
): ComparisonType | EqualityType {
  if (syllogismType === SyllogismType.Comparison) {
    return char === "M" ? ComparisonType.MoreThan : ComparisonType.LessThan;
  } else {
    return char === "S" ? EqualityType.Same : EqualityType.Opposite;
  }
}

export function generateSyllogism(config: SyllogismConfig): Syllogism {
  const variables = generateVariables(config.premiseCount + 1);
  const premises = generatePremises(config, variables);
  const question = generateQuestion(config, variables);
  const answer = determineAnswer(config.syllogismType, premises, question);

  return { premises, question, answer };
}

function generateVariables(count: number): string[] {
  return Array.from({ length: count }, () => getRandomString());
}

function generatePremises(
  config: SyllogismConfig,
  variables: string[],
): Premise[] {
  return config.sequenceType === SequenceType.Sequential
    ? generateSequentialPremises(config, variables)
    : generateNonSequentialPremises(config, variables);
}

function generateSequentialPremises(
  config: SyllogismConfig,
  variables: string[],
): Premise[] {
  return Array.from({ length: config.premiseCount }, (_, i) => {
    const left = variables[i];
    const right = variables[i + 1];
    if (left === undefined || right === undefined) {
      throw new Error(`Missing variable at index ${i} or ${i + 1}`);
    }
    return {
      left,
      right,
      relation: getRelation(config, i),
    };
  });
}

function generateNonSequentialPremises(
  config: SyllogismConfig,
  variables: string[],
): Premise[] {
  const nonSeqIndex = config.nonSequentialIndex || 0;
  const sequentialPremises = generateSequentialPremises(
    { ...config, premiseCount: nonSeqIndex },
    variables,
  );

  const nonSequentialPremises = Array.from(
    { length: config.premiseCount - nonSeqIndex },
    (_, i) => {
      const left = variables[i + nonSeqIndex + 1];
      const right =
        i === 0 ? variables[nonSeqIndex - 1] : variables[i + nonSeqIndex];
      if (left === undefined || right === undefined) {
        throw new Error(
          `Missing variable at index ${i + nonSeqIndex + 1} or ${i === 0 ? nonSeqIndex - 1 : i + nonSeqIndex}`,
        );
      }
      return {
        left,
        right,
        relation: getRelation(config, i + nonSeqIndex),
      };
    },
  );

  return [...sequentialPremises, ...nonSequentialPremises];
}

function getRelation(
  config: SyllogismConfig,
  index: number,
): ComparisonType | EqualityType {
  if (config.structure) {
    const structureChar = config.structure[index];
    if (structureChar === undefined) {
      throw new Error(`Structure character at index ${index} is undefined`);
    }
    return getRelationFromStructure(structureChar, config.syllogismType);
  }
  const relation =
    config.relationshipTypes[
      Math.floor(Math.random() * config.relationshipTypes.length)
    ];
  if (relation === undefined) {
    throw new Error("No valid relationship type found");
  }
  return relation;
}

function generateQuestion(
  config: SyllogismConfig,
  variables: string[],
): Question {
  let questionIndexes = config.questionIndexes;

  if (!questionIndexes) {
    questionIndexes = generateAllQuestionIndexes(variables.length);
  }

  const indexPair =
    questionIndexes[Math.floor(Math.random() * questionIndexes.length)];

  if (!indexPair) {
    throw new Error("No valid question indexes found");
  }

  const [leftIndex, rightIndex] = indexPair;

  const questionType =
    config.questionTypes[
      Math.floor(Math.random() * config.questionTypes.length)
    ];

  if (questionType === undefined) {
    throw new Error("No valid question type found in config");
  }

  const left = variables[leftIndex];
  const right = variables[rightIndex];

  if (left === undefined || right === undefined) {
    throw new Error(`Missing variable at index ${leftIndex} or ${rightIndex}`);
  }

  return {
    left,
    right,
    type: questionType,
  };
}

function determineAnswer(
  syllogismType: SyllogismType,
  premises: Premise[],
  question: Question,
): boolean {
  return syllogismType === SyllogismType.Comparison
    ? determineComparisonAnswer(premises, question)
    : determineEqualityAnswer(premises, question);
}

export function validateConfigAndGenerateSyllogism(
  config: SyllogismConfig,
): Syllogism | null {
  if (config.premiseCount <= 0) {
    console.error("Premise count must be greater than 0");
    return null;
  }

  if (config.structure && config.structure.length !== config.premiseCount) {
    console.error("Structure length must match premise count");
    return null;
  }

  // Generate default questionIndexes if not provided
  const questionIndexes =
    config.questionIndexes ||
    generateAllQuestionIndexes(config.premiseCount + 1);

  for (const [left, right] of questionIndexes) {
    if (left >= config.premiseCount + 1 || right >= config.premiseCount + 1) {
      console.error("Question indexes must not exceed the number of variables");
      return null;
    }
  }

  const isComparisonType = config.syllogismType === SyllogismType.Comparison;
  const validComparisonRelationships: ComparisonType[] = [
    ComparisonType.MoreThan,
    ComparisonType.LessThan,
  ];
  const validEqualityRelationships: EqualityType[] = [
    EqualityType.Same,
    EqualityType.Opposite,
  ];

  const validRelationships = isComparisonType
    ? validComparisonRelationships
    : validEqualityRelationships;

  if (
    !config.relationshipTypes.every((type) =>
      (validRelationships as any[]).includes(type),
    )
  ) {
    console.error("Relationship types do not match syllogism type");
    return null;
  }

  if (
    !config.questionTypes.every((type) =>
      (validRelationships as any[]).includes(type),
    )
  ) {
    console.error("Question types do not match syllogism type");
    return null;
  }

  if (config.sequenceType === SequenceType.NonSequential) {
    if (
      config.nonSequentialIndex === undefined ||
      config.nonSequentialIndex >= config.premiseCount
    ) {
      console.error("Invalid non-sequential index");
      return null;
    }
  }

  if (config.structure) {
    const validChars = isComparisonType ? ["M", "L"] : ["S", "O"];
    if (
      !config.structure.split("").every((char) => validChars.includes(char))
    ) {
      console.error("Invalid characters in structure");
      return null;
    }
  }

  const validatedConfig: SyllogismConfig = {
    ...config,
    questionIndexes: questionIndexes,
  };

  return generateSyllogism(validatedConfig);
}

const syllogismStages: { [key: string]: SyllogismConfig } = {
  stage3: {
    syllogismType: SyllogismType.Equality,
    relationshipTypes: [EqualityType.Opposite],
    questionTypes: [EqualityType.Same],
    sequenceType: SequenceType.NonSequential,
    nonSequentialIndex: 1,
    questionIndexes: [
      [0, 4],
      [1, 4],
    ],
    premiseCount: 4,
  },
};

// const stageConfig = syllogismStages.stage3;

// if (stageConfig) {
//   const result = validateConfigAndGenerateSyllogism(stageConfig);
//   console.log(JSON.stringify(result, null, 2));
// } else {
//   console.error("Stage configuration is undefined");
// }
