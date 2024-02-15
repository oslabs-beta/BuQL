import { User } from './models';
import { faker } from '@faker-js/faker';

const generateRandomUser = (num) => {
  const users = [];

  for (let i = 0; i < num; i++) {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate(),
      registeredAt: faker.date.past(),
    };

    users.push(user);
  }

  return users;
};

export const addToDb = async (num) => {
  // mongoose insert many
  const userArray = generateRandomUser(num);
  const result = await User.insertMany(userArray);
  //   return result;
  console.log(result);
};

const deleteAllFromDb = async () => {
  // mongoose delete many
  const result = await User.deleteMany({});
  console.log(result);
};