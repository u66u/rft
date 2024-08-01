// this function seems to work properly, test it more and use its output as reference

// function generateSyllogism(config: SyllogismConfig): Syllogism {
//   const variables: string[] = [];
//   const premises: Premise[] = [];

//   // Generate variables
//   for (let i = 0; i < config.premiseCount + 1; i++) {
//     variables.push(getRandomString());
//   }

//   // Generate premises
//   if (config.sequenceType === SequenceType.Sequential) {
//     for (let i = 0; i < config.premiseCount; i++) {
//       let relation: ComparisonType | EqualityType;
//       if (config.structure) {
//         relation = getRelationFromStructure(
//           config.structure[i],
//           config.syllogismType,
//         );
//       } else {
//         relation =
//           config.relationshipTypes[
//             Math.floor(Math.random() * config.relationshipTypes.length)
//           ];
//       }
//       premises.push({
//         left: variables[i],
//         right: variables[i + 1],
//         relation: relation,
//       });
//     }
//   } else if (config.sequenceType === SequenceType.NonSequential) {
//     const nonSeqIndex = config.nonSequentialIndex || 0;

//     console.log(variables);
//     for (let i = 0; i < nonSeqIndex; i++) {
//       let relation: ComparisonType | EqualityType;
//       if (config.structure) {
//         relation = getRelationFromStructure(
//           config.structure[i],
//           config.syllogismType,
//         );
//       } else {
//         relation =
//           config.relationshipTypes[
//             Math.floor(Math.random() * config.relationshipTypes.length)
//           ];
//       }
//       premises.push({
//         left: variables[i],
//         right: variables[i + 1],
//         relation: relation,
//       });
//     }

//     let firstNonSeqRelation: ComparisonType | EqualityType;
//     if (config.structure) {
//       firstNonSeqRelation = getRelationFromStructure(
//         config.structure[nonSeqIndex],
//         config.syllogismType,
//       );
//     } else {
//       firstNonSeqRelation =
//         config.relationshipTypes[
//           Math.floor(Math.random() * config.relationshipTypes.length)
//         ];
//     }
//     premises.push({
//       left: variables[nonSeqIndex + 1],
//       right: variables[nonSeqIndex - 1],
//       relation: firstNonSeqRelation,
//     });

//     for (let i = nonSeqIndex + 1; i < config.premiseCount; i++) {
//       let relation: ComparisonType | EqualityType;
//       if (config.structure) {
//         relation = getRelationFromStructure(
//           config.structure[i],
//           config.syllogismType,
//         );
//       } else {
//         relation =
//           config.relationshipTypes[
//             Math.floor(Math.random() * config.relationshipTypes.length)
//           ];
//       }
//       premises.push({
//         left: variables[i + 1],
//         right: variables[i],
//         relation: relation,
//       });
//     }
//   }

//   const [leftIndex, rightIndex] =
//     config.questionIndexes[
//       Math.floor(Math.random() * config.questionIndexes.length)
//     ];
//   const questionType =
//     config.questionTypes[
//       Math.floor(Math.random() * config.questionTypes.length)
//     ];
//   const question: Question = {
//     left: variables[leftIndex],
//     right: variables[rightIndex],
//     type: questionType,
//   };

//   let answer: boolean;
//   if (config.syllogismType === SyllogismType.Comparison) {
//     answer = determineComparisonAnswer(premises, question);
//   } else {
//     answer = determineEqualityAnswer(premises, question);
//   }

//   return { premises, question, answer };
// }
