import { faker } from '@faker-js/faker';

export const createPostData = (userId: number) => {
  return {
    user_id: userId,
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(2)
  };
};
