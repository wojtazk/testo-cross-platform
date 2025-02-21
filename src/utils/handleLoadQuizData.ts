import { exists, readDir, readTextFile, stat } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';

type Options = {
  loadProgress?: boolean;
  quizInitialReps: number;
};

type SaveJSONType = {
  location: string;
  numberOfQuestions: number;
  numberOfBadAnswers: number;
  numberOfCorrectAnswers: number;
  numberOfLearnedQuestions: number;
  time: number;
  reoccurrences: { tag: string; value: number }[];
};

export const handleLoadQuizData = async (options: Options, path: string) => {
  const pathExists = await exists(path);
  if (!pathExists) {
    console.error('Path does not exist');
    return;
  }

  const metadata = await stat(path);
  // only allow opening dirs
  if (metadata.isFile) {
    console.error('Opening files not supported');
    return;
  }

  // read direcotry contents
  const dirContent = await readDir(path);
  // get only .txt files (quiz questions)
  const questionFiles = dirContent.filter(
    (file) => file.isFile && file.name.endsWith('.txt')
  );

  // FIXME
  // parse files into quiz questions
  const questions = await Promise.all(
    questionFiles.map(async (questionFile) => {
      const fileContent = await readTextFile(
        await join(path, questionFile.name)
      );

      // new line windows - \r\n, else - /n
      const lines = fileContent.split(/\r?\n/).filter((line) => line !== '');

      // parse into X and Y questions
      // const question = {};

      return lines;
    })
  );

  // check if save file exists
  const saveFilePath = await join(path, 'save.json');
  const saveFileExists = await exists(saveFilePath);

  // try to parse save.json
  let saveJSON: SaveJSONType | null = null;

  if (options.loadProgress) {
    if (saveFileExists) {
      try {
        saveJSON = JSON.parse(await readTextFile(saveFilePath)) as SaveJSONType;
        // update save.json location (directory path)
        saveJSON.location = path;
      } catch (err) {
        console.warn('Error while parsing save.json\n', err);
      }
    }
  }
  // create new save.json if its null
  if (saveJSON === null) {
    saveJSON = {
      location: path,
      numberOfQuestions: questionFiles.length,
      numberOfBadAnswers: 0,
      numberOfCorrectAnswers: 0,
      numberOfLearnedQuestions: 0,
      time: 0,
      reoccurrences: questionFiles.map((question) => {
        return { tag: question.name, value: options.quizInitialReps };
      }),
    };
  }

  return { saveJSON, questions };
};
