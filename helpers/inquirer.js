import inquirer from "inquirer";
import colors from "colors";

const questions = [
  {
    type: "list",
    name: "option",
    message: "What do you want to do?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Search city`,
      },
      {
        value: 2,
        name: `${"2.".green} History`,
      },
      {
        value: 0,
        name: `${"0.".green} Exit`,
      },
    ],
  },
];

export const inquirerMenu = async () => {
  console.clear();
  const { option } = await inquirer.prompt(questions);

  return option;
};

export const pause = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Press ${"ENTER".green} to continue`,
    },
  ];

  console.log();
  await inquirer.prompt(question);
};

export const readInput = async (message) => {
  const inputQuestion = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Please enter a value";
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(inputQuestion);
  return desc;
};

export const listPlaces = async (places = []) => {
  const choices = places.map((place, i) => {
    const idx = `${i + 1}`;
    const { name, id } = place;
    return {
      value: id,
      name: `${idx.green}. ${name}`,
    };
  });

  if (!choices.length) {
    return null;
  }

  choices.push({
    value: "0",
    name: `${"0".green}` + " Cancel",
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Cities:",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
};
