import mongoose from "mongoose";
import Task from "../models/tasks";

export interface ReportFilter {
  startDate?: Date;
  endDate?: Date;
  projectId?: string;
  status?: string;
}

export const getReportDataService = async (filters: ReportFilter) => {
  const match: any = {};

  if (filters.status) {
    match.status = filters.status;
  }

  if (filters.projectId) {
    match.projectId = new mongoose.Types.ObjectId(filters.projectId);
  }

  if (filters.startDate || filters.endDate) {
    match.deadline = {};
    if (filters.startDate) match.deadline.$gte = filters.startDate;
    if (filters.endDate) match.deadline.$lte = filters.endDate;
  }

  const results = await Task.aggregate([
    { $match: match },
    {
      $facet: {
        statusSummary: [
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],
        prioritySummary: [
          { $group: { _id: "$priority", count: { $sum: 1 } } }
        ],
        tasks: [
          { $sort: { deadline: 1 } },
          {
            $lookup: {
              from: "users",
              localField: "assignedTo",
              foreignField: "_id",
              as: "assignedTo",
            },
          },
          { $unwind: { path: "$assignedTo", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "projects",
              localField: "projectId",
              foreignField: "_id",
              as: "project",
            },
          },
          { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
        ],
      },
    },
  ]);

  return results[0] || { statusSummary: [], prioritySummary: [], tasks: [] };
};
