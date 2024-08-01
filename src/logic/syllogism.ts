import { strings } from "./constants";

type ComparisonType = "moreThan" | "lessThan";
type EqualityType = "same" | "opposite";
type SyllogismType = "comparison" | "equality";

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

function generateComparisonSyllogism(
  premiseCount: number,
  syllogismType: ComparisonType,
  questionType: ComparisonType,
  questionIndexes: [number, number],
): Syllogism {
  const premises: Premise[] = [];
  const usedStrings: string[] = [];

  for (let i = 0; i < premiseCount + 1; i++) {
    let str: string;
    do {
      str = getRandomString();
    } while (usedStrings.includes(str));
    usedStrings.push(str);
  }

  for (let i = 0; i < premiseCount; i++) {
    premises.push({
      left: usedStrings[i],
      right: usedStrings[i + 1],
      relation: syllogismType,
    });
  }

  const [leftIndex, rightIndex] = questionIndexes;
  const question: Question = {
    left: usedStrings[leftIndex],
    right: usedStrings[rightIndex],
    type: questionType,
  };

  let answer: boolean;
  if (syllogismType === questionType) {
    answer = leftIndex < rightIndex;
  } else {
    answer = leftIndex > rightIndex;
  }

  return { premises, question, answer };
}

function generateEqualitySyllogism(
  premiseCount: number,
  questionType: EqualityType,
  questionIndexes: [number, number],
): Syllogism {
  const premises: Premise[] = [];
  const usedStrings: string[] = [];

  for (let i = 0; i < premiseCount + 1; i++) {
    let str: string;
    do {
      str = getRandomString();
    } while (usedStrings.includes(str));
    usedStrings.push(str);
  }

  for (let i = 0; i < premiseCount; i++) {
    premises.push({
      left: usedStrings[i],
      right: usedStrings[i + 1],
      relation: Math.random() < 0.5 ? "same" : "opposite",
    });
  }

  const [leftIndex, rightIndex] = questionIndexes;
  const question: Question = {
    left: usedStrings[leftIndex],
    right: usedStrings[rightIndex],
    type: questionType,
  };

  let answer = true;
  let currentRelation: EqualityType = "same";
  for (let i = leftIndex; i < rightIndex; i++) {
    if (premises[i].relation === "opposite") {
      currentRelation = currentRelation === "same" ? "opposite" : "same";
    }
  }
  answer = currentRelation === questionType;

  return { premises, question, answer };
}

function generateSyllogism(
  type: SyllogismType,
  premiseCount: number,
  questionType: ComparisonType | EqualityType,
  questionIndexes: [number, number],
  syllogismType?: ComparisonType,
): Syllogism {
  if (type === "comparison" && syllogismType) {
    return generateComparisonSyllogism(
      premiseCount,
      syllogismType,
      questionType as ComparisonType,
      questionIndexes,
    );
  } else if (type === "equality") {
    return generateEqualitySyllogism(
      premiseCount,
      questionType as EqualityType,
      questionIndexes,
    );
  } else {
    throw new Error(
      "Invalid syllogism type or missing syllogismType for comparison syllogism",
    );
  }
}

const comparisonSyllogism = generateSyllogism(
  "comparison",
  3,
  "moreThan",
  [0, 3],
  "lessThan",
);

const equalitySyllogism = generateSyllogism("equality", 1, "same", [0, 1]);
console.log("Equality Syllogism:", equalitySyllogism);

const test1 = generateSyllogism("equality", 1, "opposite", [0, 1]);
