import { Router } from "express";
import checkAuthToken from "../middlewares/checkAuthToken";
import {
  transcribeAudio,
  generateTranscriptSummary,
  reduceTranscription
} from "../services/speechService";

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

speechRouter.post("/speech/reduce", checkAuthToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Você precisa estar logado para acessar este recurso.",
      });
    }

    const { transcription } = req.body;

    if (!transcription) {
      return res.status(404).json({
        message:
          "Algumas informações estão faltando. Verifique e tente novamente.",
      });
    }

    const reducedTranscription = await reduceTranscription(transcription);

    return res.status(200).json({ text: reducedTranscription });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno no servidor. Tente novamente mais tarde.",
    });
  }
});

speechRouter.post("/speech/summary", checkAuthToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Você precisa estar logado para acessar este recurso.",
      });
    }

    const { transcription } = req.body;

    if (!transcription) {
      return res.status(404).json({
        message:
          "Algumas informações estão faltando. Verifique e tente novamente.",
      });
    }

    const summary = await generateTranscriptSummary(transcription);

    return res.status(200).json(summary);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno no servidor. Tente novamente mais tarde.",
    });
  }
});

export default speechRouter;
