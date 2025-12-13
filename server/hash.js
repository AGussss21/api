import bcrypt from "bcrypt";

const run = async () => {
  const password = "agus5321"; // ganti password yang kamu mau
  const hash = await bcrypt.hash(password, 10);
  console.log("HASH RESULT:", hash);
};

run();
