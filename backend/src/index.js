import app from "./app.js";
import { db } from "./db/dbConfig.js";

const port = process.env.PORT || 5000;

db()
  .then(() => {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((err) => {
    console.error("failed to connect to database", err);
  });

