import { Router } from "express";
import checkAuthToken from "../middlewares/checkAuthToken";
import { getGoogleTokenWithAuthCode } from "../services/googleService";

const googleRouter = Router();

googleRouter.post("/google/auth", checkAuthToken, async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Código de autorização não fornecido ou inválido." });
    }

    const data = await getGoogleTokenWithAuthCode(code);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno no servidor. Tente novamente mais tarde.",
    });
  }
});

export default googleRouter;
