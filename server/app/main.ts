import cors from "cors";
import express from "express";
import { config } from "./core/config";
import { resolveUsername } from "./core/auth";
import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(resolveUsername);
app.use("/api", router);

app.listen(config.port, () => {
	console.log(`SonicLight backend listening on port ${config.port}`);
});
