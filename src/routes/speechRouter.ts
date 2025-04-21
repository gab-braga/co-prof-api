import { Router } from "express";
import checkAuthToken from "../middlewares/checkAuthToken";
import { transcribeAudio } from "../services/openaiService";

const speechRouter = Router();

speechRouter.post("/speech/transcribe", checkAuthToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Você precisa estar logado para acessar este recurso.",
      });
    }

    const { audioURL } = req.body;

    if (!audioURL) {
      return res.status(404).json({
        message:
          "Algumas informações estão faltando. Verifique e tente novamente.",
      });
    }

    const transcription = await transcribeAudio(audioURL);

    return res.status(200).json({ transcription });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno no servidor. Tente novamente mais tarde.",
    });
  }
});

export default speechRouter;
