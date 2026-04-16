import { Request, Response } from "express";
import { getReportDataService, ReportFilter } from "../services/reports_service";

export const getReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, projectId, status } = req.query;

    const filters: ReportFilter = {};

    if (status) filters.status = status as string;
    if (projectId) filters.projectId = projectId as string;
    
    if (startDate) {
      filters.startDate = new Date(startDate as string);
      if (isNaN(filters.startDate.getTime())) {
        res.status(400).json({ error: "Invalid startDate format" });
        return;
      }
    }

    if (endDate) {
      filters.endDate = new Date(endDate as string);
      if (isNaN(filters.endDate.getTime())) {
        res.status(400).json({ error: "Invalid endDate format" });
        return;
      }
    }

    const reportData = await getReportDataService(filters);
    res.status(200).json(reportData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
