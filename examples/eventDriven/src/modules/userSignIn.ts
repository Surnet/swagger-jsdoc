// ou usersignin event it will be placed here
export const userSignIn = (job: Job<{ userId: string }>) => {
  const { userId } = job.data;

  console.log("User Logged", userId);
};
