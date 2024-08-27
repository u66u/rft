export enum SyllogismType {
  Comparison = "comparison",
  Equality = "equality",
}

export enum ComparisonType {
  MoreThan = "more than",
  LessThan = "less than",
}

export enum EqualityType {
  Same = "the same as",
  Opposite = "opposite to",
}

export enum SequenceType {
  Sequential = "sequential",
  NonSequential = "nonSequential",
}

export interface SyllogismConfig {
  syllogismType: SyllogismType;
  relationshipTypes: (ComparisonType | EqualityType)[]; // what relationships between variables within a syllogism can be used? Just more than? Just less then? Both more/less than? etc
  questionTypes: (ComparisonType | EqualityType)[]; // what question or questions to ask at the end?
  sequenceType: SequenceType; // Sequential (A>B, B>C, C>D) or Non-sequential (A>B, C>A, D>C)
  nonSequentialIndex?: number; // non-sequential premises starting from premise of what index? (0-based)
  questionIndexes?: [number, number][]; // variables of what indexes can be used to comprise the final question (0-baesd)
  structure?: string; // specific structure of relationships in a syllogism, i.e. SOOS is same, opposoite, opposite, same. LLLM - less, less, less than, more than. Length should match premise count
  premiseCount: number;
}

export interface Premise {
  left: string;
  right: string;
  relation: ComparisonType | EqualityType;
}

export interface Question {
  left: string;
  right: string;
  type: ComparisonType | EqualityType;
}

export interface Syllogism {
  premises: Premise[];
  question: Question;
  answer: boolean;
}
