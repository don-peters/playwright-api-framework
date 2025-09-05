import { faker } from '@faker-js/faker';

export const createCommentData = (postId: number) => {
  return {
    post_id: postId,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    body: faker.lorem.paragraph(1) // shorter body for better readability
  };
};
