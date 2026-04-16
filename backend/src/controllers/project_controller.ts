import { Request, Response } from "express";
import Project from "../models/projects";

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, createdBy } = req.body;
    const project = new Project({ name, description, createdBy });
    await project.save();
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
