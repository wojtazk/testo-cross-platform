type QuestionX = {
  tag: string; // name of the file
  type: 'X';
  content: string;
  answers: { content: string; correct: boolean }[];
};
type QuestionY = {
  tag: string;
  type: 'Y';
  content: string;
  // list of options and index of the correct one
  answers: { content: string[]; correct: number }[];
};

export const parseQuizQuestion = (fileName: string, lines: string[]) => {
  const questionObj = {} as QuestionX | QuestionY;
  const firstLine = lines[0];

  // check if question is valid
  if (!(firstLine[0] === 'X' || firstLine[0] === 'Y'))
    throw Error(`Invalid Question: ${fileName}`);

  // common part of X and Y questions
  questionObj.tag = fileName;
  questionObj.type = firstLine[0];
  questionObj.content = lines[1];
  questionObj.answers = [];

  // parse X (X0010 etc)
  // FIXME: replace images inside the questions and answers contents
  if (questionObj.type === 'X') {
    for (let i = 1; i < firstLine.length; i++) {
      questionObj.answers.push({
        content: lines[i + 1],
        correct: firstLine[i] === '1',
      });
    }

    return questionObj;
  }

  // parse Y (Y_123 etc)
  if (questionObj.type === 'Y') {
    for (let i = 2; i < firstLine.length; i++) {
      questionObj.answers.push({
        content: lines[i].split(';;').filter((val) => val !== ''),
        correct: Number(firstLine[i]) - 1,
      });
    }

    return questionObj;
  }
};
