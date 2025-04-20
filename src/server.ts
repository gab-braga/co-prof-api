import app from "./app/app";

const port = (process.env.PORT || 8080) as number;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log("Server running on port", port);
});
