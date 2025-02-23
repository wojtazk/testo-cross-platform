import {
  exists,
  readDir,
  readTextFile,
  stat,
  readFile,
  DirEntry,
} from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import { parseQuizQuestion } from './parseQuizQuestion';

export type SaveJSONType = {
  location: string; // directory path
  numberOfQuestions: number;
  numberOfBadAnswers: number;
  numberOfCorrectAnswers: number;
  numberOfLearnedQuestions: number;
  time: number;
  reoccurrences: { tag: string; value: number }[] | [];
};

export type Images = {
  [key: string]: string;
};

type Options = {
  loadProgress?: boolean;
  quizInitialReps: number;
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
    console.error(`Not a directory: ${path}`);
    return;
  }

  // read direcotry contents
  const dirContent = await readDir(path);

  // filter directory files
  const questionFiles = [] as DirEntry[];
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
  const imageFiles = [] as DirEntry[];
  dirContent.forEach((item) => {
    if (!item.isFile) return;

    if (item.name.endsWith('.txt')) {
      questionFiles.push(item);
      return;
    }
    if (imageExtensions.some((ext) => item.name.endsWith(ext))) {
      imageFiles.push(item);
      return;
    }
  });

  // get the save.json
  const saveJSON = (async () => {
    let saveJSON: SaveJSONType | null = null;
    // try to parse save.json
    if (options.loadProgress) {
      // get save.json file path
      const saveJSONPath = await join(path, 'save.json');
      if (await exists(saveJSONPath)) {
        try {
          saveJSON = JSON.parse(
            await readTextFile(saveJSONPath)
          ) as SaveJSONType;
          // update save.json location
          saveJSON.location = path;
          // update number of questions (possibly loaded new ones)
          saveJSON.numberOfQuestions = questionFiles.length;
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
        reoccurrences: [], // unnecessary when creating new save.json
      };
    }

    return saveJSON;
  })();

  // read image binary data and convert it to base64
  const images = (async () => {
    const images = {} as Images;
    for (const imageFile of imageFiles) {
      const imageBinary = await readFile(await join(path, imageFile.name));

      // convert to Base64
      const imageBase64 = btoa(
        imageBinary.reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      images[imageFile.name] = imageBase64;
    }

    return images;
  })();

  // parse files into quiz questions
  const questions = Promise.all(
    questionFiles.map(async (questionFile) => {
      const fileContent = await readTextFile(
        await join(path, questionFile.name)
      );

      // NOTE: new line windows - '\r\n', else - '/n'
      const lines = fileContent
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line !== '');

      // get question reoccurrences
      let questionReoccurrences = options.quizInitialReps;
      if (options.loadProgress) {
        questionReoccurrences =
          (await saveJSON).reoccurrences.find(
            (item) => item.tag === questionFile.name
          )?.value ?? options.quizInitialReps;
      }

      // parse into X and Y questions
      return parseQuizQuestion(questionFile.name, questionReoccurrences, lines);
    })
  );

  return {
    saveJSON: await saveJSON,
    questions: await questions,
    images: await images,
  };
};
