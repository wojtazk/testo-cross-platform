type QuestionX = {
  tag: string; // name of the file
  reoccurrences: number;
  type: 'X';
  content: string;
  answers: { content: string; correct: boolean }[];
};
type QuestionY = {
  tag: string;
  reoccurrences: number;
  type: 'Y';
  content: string;
  // list of options and index of the correct one
  answers: { content: string[]; correct: number }[];
};
export type Question = QuestionX | QuestionY;

export const parseQuizQuestion = (
  fileName: string,
  reoccurrences: number,
  lines: string[]
) => {
  try {
    // naprawdę kurwa nie umiecie napisać bez błedów paru linijek txt????
    // check if question has content inside (first row, question, answers)
    if (!(lines.length > 2)) throw Error(`Invalid Question: ${fileName}`);

    // check if question is valid
    if (!(lines[0][0] === 'X' || lines[0][0] === 'Y'))
      throw Error(`Invalid Question: ${fileName}`);

    const questionObj = {} as Question;
    const firstLine = lines[0];

    // common part of X and Y questions
    questionObj.tag = fileName;
    questionObj.reoccurrences = reoccurrences;
    questionObj.type = firstLine[0] as 'X' | 'Y';
    questionObj.content = lines[1];
    questionObj.answers = [];

    // parse X (X0010 etc)
    if (questionObj.type === 'X') {
      for (let i = 1; i < firstLine.length; i++) {
        questionObj.answers.push({
          content:
            i + 1 < lines.length
              ? lines[i + 1]
              : '[ COŚ CHYBA JEST ZJEBANE W PYTANIU 👏👏👏👏 ]',
          correct: firstLine[i] === '1',
        });
      }

      return questionObj;
    }

    // parse Y (Y_123 etc)
    if (questionObj.type === 'Y') {
      for (let i = 2; i < firstLine.length; i++) {
        questionObj.answers.push({
          content:
            i < lines.length
              ? lines[i].split(';;').filter((val) => val !== '')
              : ['COŚ', 'CHYBA', 'JEST', 'ZJEBANE', 'W', 'PYATNIU', '👏👏👏👏'],
          correct: Number(firstLine[i]) - 1,
        });
      }

      return questionObj;
    }
  } catch (error) {
    console.error(error);

    const questionObj = {} as Question;
    questionObj.tag = fileName;
    questionObj.reoccurrences = 7_000_000_000;
    questionObj.type = 'X';
    questionObj.content = 'To pytanie ma błąd ...';
    questionObj.answers = [{ content: 'Napraw to dzbanie', correct: true }];

    return questionObj;
  }
};
