export const userSignUp = (job: Job<{ userId: string }>) => {
  const { userId } = job.data;

  console.log("User Registered", userId);
};
