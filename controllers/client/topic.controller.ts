import { Request, Response } from "express";
import Topic from "../../model/topic.model";

//[GET] /topics
export const index = async (req: Request, res: Response): Promise<void> => {
  const topics = await Topic.find({
    status: "active",
    deleted: false
  });

  res.render("client/pages/topics/topic", {
    pageTitle: "Trang chủ đề",
    topics: topics || [],
  });
};