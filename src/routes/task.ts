import { Router } from "express";
import { eq } from "drizzle-orm";
import { auth, AuthRequest } from "../middleware/auth";
import { NewTask, tasks } from "../db/schema";
import { db } from "../db";

const taskRouter = Router();

/// Create new task
taskRouter.post("/", auth, async (req: AuthRequest, res) => {
  try {
    req.body = { ...req.body, dueAt: new Date(req.body.dueAt), uid: req.user! };
    const newTask: NewTask = req.body;

    const [task] = await db.insert(tasks).values(newTask).returning();

    res.status(201).json(task);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

/// Get all tasks
taskRouter.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const allTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.uid, req.user!));

    res.json(allTasks);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

/// Delete task
taskRouter.delete("/", auth, async (req: AuthRequest, res) => {
  try {
    const { taskId }: { taskId: string } = req.body;
    await db.delete(tasks).where(eq(tasks.id, taskId));

    res.json(true);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

export default taskRouter;
