import { strings } from "./constants";

type Graph = Map<string, Map<string, ComparisonType | EqualityType>>;

enum SyllogismType {
  Comparison = "comparison",
  Equality = "equality",
}

enum ComparisonType {
  MoreThan = "moreThan",
  LessThan = "lessThan",
}

enum EqualityType {
  Same = "same",
  Opposite = "opposite",
}

enum SequenceType {
  Sequential = "sequential",
  NonSequential = "nonSequential",
}

interface SyllogismConfig {
  syllogismType: SyllogismType;
  relationshipTypes: (ComparisonType | EqualityType)[]; // what relationships between variables within a syllogism can be used? Just more than? Just less then? Both more/less than? etc
  questionTypes: (ComparisonType | EqualityType)[]; // what question or questions to ask at the end?
  sequenceType: SequenceType; // Sequential (A>B, B>C, C>D) or Non-sequential (A>B, C>A, D>C)
  nonSequentialIndex?: number; // non-sequential premises starting from premise of what index? (0-based)
  questionIndexes: [number, number][]; // variables of what indexes can be used to comprise the final question (0-baesd)
  structure?: string; // specific structure of relationships in a syllogism, i.e. SOOS is same, opposoite, opposite, same. LLLM - less, less, less than, more than. Length should match premise count
  premiseCount: number;
}

interface Premise {
  left: string;
  right: string;
  relation: ComparisonType | EqualityType;
}

interface Question {
  left: string;
  right: string;
  type: ComparisonType | EqualityType;
}

interface Syllogism {
  premises: Premise[];
  question: Question;
  answer: boolean;
}

function getRandomString(): string {
  return strings[Math.floor(Math.random() * strings.length)];
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

function generateSyllogism(config: SyllogismConfig): Syllogism {
  const variables: string[] = [];
  const premises: Premise[] = [];

  // Generate variables
  for (let i = 0; i < config.premiseCount + 1; i++) {
    variables.push(getRandomString());
  }

  // Generate premises
  if (config.sequenceType === SequenceType.Sequential) {
    for (let i = 0; i < config.premiseCount; i++) {
      let relation: ComparisonType | EqualityType;
      if (config.structure) {
        relation = getRelationFromStructure(
          config.structure[i],
          config.syllogismType,
        );
      } else {
        relation =
          config.relationshipTypes[
            Math.floor(Math.random() * config.relationshipTypes.length)
          ];
      }
      premises.push({
        left: variables[i],
        right: variables[i + 1],
        relation: relation,
      });
    }
  } else if (config.sequenceType === SequenceType.NonSequential) {
    const nonSeqIndex = config.nonSequentialIndex || 0;

    console.log(variables);
    // Generate sequential premises up to nonSeqIndex
    for (let i = 0; i < nonSeqIndex; i++) {
      let relation: ComparisonType | EqualityType;
      if (config.structure) {
        relation = getRelationFromStructure(
          config.structure[i],
          config.syllogismType,
        );
      } else {
        relation =
          config.relationshipTypes[
            Math.floor(Math.random() * config.relationshipTypes.length)
          ];
      }
      premises.push({
        left: variables[i],
        right: variables[i + 1],
        relation: relation,
      });
    }

    // Push the first non-sequential premise
    let firstNonSeqRelation: ComparisonType | EqualityType;
    if (config.structure) {
      firstNonSeqRelation = getRelationFromStructure(
        config.structure[nonSeqIndex],
        config.syllogismType,
      );
    } else {
      firstNonSeqRelation =
        config.relationshipTypes[
          Math.floor(Math.random() * config.relationshipTypes.length)
        ];
    }
    premises.push({
      left: variables[nonSeqIndex + 1],
      right: variables[nonSeqIndex - 1],
      relation: firstNonSeqRelation,
    });

    // Generate remaining non-sequential premises
    for (let i = nonSeqIndex + 1; i < config.premiseCount; i++) {
      let relation: ComparisonType | EqualityType;
      if (config.structure) {
        relation = getRelationFromStructure(
          config.structure[i],
          config.syllogismType,
        );
      } else {
        relation =
          config.relationshipTypes[
            Math.floor(Math.random() * config.relationshipTypes.length)
          ];
      }
      premises.push({
        left: variables[i + 1],
        right: variables[i],
        relation: relation,
      });
    }
  }

  // Generate the question
  const [leftIndex, rightIndex] =
    config.questionIndexes[
      Math.floor(Math.random() * config.questionIndexes.length)
    ];
  const questionType =
    config.questionTypes[
      Math.floor(Math.random() * config.questionTypes.length)
    ];
  const question: Question = {
    left: variables[leftIndex],
    right: variables[rightIndex],
    type: questionType,
  };

  // Determine answer
  let answer: boolean;
  if (config.syllogismType === SyllogismType.Comparison) {
    answer = determineComparisonAnswer(premises, question);
  } else {
    answer = determineEqualityAnswer(premises, question);
  }

  return { premises, question, answer };
}

function validateConfigAndGenerateSyllogism(
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

  for (const [left, right] of config.questionIndexes) {
    if (left >= config.premiseCount + 1 || right >= config.premiseCount + 1) {
      console.error("Question indexes must not exceed the number of variables");
      return null;
    }
  }

  const isComparisonType = config.syllogismType === SyllogismType.Comparison;
  const validRelationships = isComparisonType
    ? [ComparisonType.MoreThan, ComparisonType.LessThan]
    : [EqualityType.Same, EqualityType.Opposite];

  if (
    !config.relationshipTypes.every((type) =>
      validRelationships.includes(type as any),
    )
  ) {
    console.error("Relationship types do not match syllogism type");
    return null;
  }

  if (
    !config.questionTypes.every((type) =>
      validRelationships.includes(type as any),
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

  return generateSyllogism(config);
}

const syllogismStages: { [key: string]: SyllogismConfig } = {
  stage3: {
    syllogismType: SyllogismType.Equality,
    relationshipTypes: [EqualityType.Opposite, EqualityType.Same],
    questionTypes: [EqualityType.Same],
    sequenceType: SequenceType.Sequential,
    nonSequentialIndex: 1,
    questionIndexes: [[0, 4]],
    structure: "SOSO",
    premiseCount: 4,
  },
};

const result = validateConfigAndGenerateSyllogism(syllogismStages.stage3);
console.log(JSON.stringify(result, null, 2));
