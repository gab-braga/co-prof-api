import { Router } from "express";
import Sort from "../interfaces/Sort";
import Filter from "../interfaces/Filter";
import checkAuthToken from "../middlewares/checkAuthToken";
import { findById, findWithFilters, remove, save } from "../firebase/db";

const recordingRouter = Router();

recordingRouter.post("/recordings", checkAuthToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Você precisa estar logado para acessar este recurso.",
      });
    }

    const {
      classId,
      recordingStartTime,
      recordingStopTime,
      transcript,
      uploadData,
      summaryData
    } =
      req.body;

    if (
      !classId ||
      !recordingStartTime ||
      !recordingStopTime ||
      !transcript ||
      !uploadData||
      !summaryData
    ) {
      return res.status(400).json({
        message:
          "Algumas informações estão faltando. Verifique e tente novamente.",
      });
    }

    const result = await findById("classes", classId);

    if (!result) {
      return res.status(404).json({
        message: "Este recurso não foi encontrado.",
      });
    }

    const userId = user.uid as string;

    if (result.userId !== userId) {
      return res.status(401).json({
        message: "Você não tem autorização para acessar este recurso.",
      });
    }

    const createdAt = new Date();
    const data = {
      userId,
      classId,
      recordingStartTime,
      recordingStopTime,
      transcript,
      uploadData,
      summaryData,
      createdAt,
    };

    const recording = await save("recordings", data);

    return res.status(200).json(recording);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno no servidor. Tente novamente mais tarde.",
    });
  }
});

recordingRouter.get(
  "/recordings/classes/:id",
  checkAuthToken,
  async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Você precisa estar logado para acessar este recurso.",
        });
      }

      const classId = req.params.id;
      const result = await findById("classes", classId);

      if (!result) {
        return res.status(404).json({
          message: "Este recurso não foi encontrado.",
        });
      }

      const userId = user.uid as string;

      if (result.userId !== userId) {
        return res.status(401).json({
          message: "Você não tem autorização para acessar este recurso.",
        });
      }

      const filters: Filter[] = [
        { field: "userId", value: userId },
        { field: "classId", value: classId },
      ];
      const sort: Sort = { field: "createdAt", direction: "desc" };

      const recordings = await findWithFilters("recordings", filters, sort);

      return res.status(200).json(recordings);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Error interno no servidor. Tente novamente mais tarde.",
      });
    }
  }
);

recordingRouter.delete("/recordings/:id", checkAuthToken, async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Você precisa estar logado para acessar este recurso.",
        });
      }

      const recordingId = req.params.id;
      const recording = await findById("recordings", recordingId);

      if (!recording) {
        return res.status(404).json({
          message: "Este recurso não foi encontrado.",
        });
      }

      const userId = user.uid as string;

      if (recording.userId !== userId) {
        return res.status(401).json({
          message: "Você não tem autorização para acessar este recurso.",
        });
      }

      await remove("recordings", recordingId);

      return res.status(200).json({ message: "Este recurso foi removido." });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Error interno no servidor. Tente novamente mais tarde.",
      });
    }
  }
);

export default recordingRouter;
