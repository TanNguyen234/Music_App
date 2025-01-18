import { Request, Response } from "express";
import Topic from "../../model/topic.model";
import Song from "../../model/song.model";
import { convertToSlug } from "../../helpers/convertToSlug";
import { CustomRequest } from "../../interface/CustomRequest";

//[GET] /result
export const index = async (req: CustomRequest, res: Response): Promise<void> => {
  const id: String | unknown = req.query.id || "";
  var songs = null, topic = null;
  const keyword: any = req.query.keyword || "";

  if (id || keyword) {
    if(id && keyword) {
      topic = await Topic.findOne({
        _id: id,
        status: "active",
        deleted: false,
      });

      if (!topic) {
          req.flash('error', "id chủ đề không hợp lệ!")
          res.redirect("/topics");
      } else {
        const keywordRegex = new RegExp(keyword, 'i');

        //Tạo slug không dấu có dấu trừ ngăn cách
        const slug = convertToSlug(keyword);
        const slugRegex = new RegExp(slug, 'i');

        songs = await Song.find({
            $or: [
                { title: keywordRegex },
                { slug: slugRegex }
            ],
            deleted: false
        });
      } 
    } else if (id) {
      topic = await Topic.findOne({
        _id: id,
        status: "active",
        deleted: false,
      });

      if (!topic) {
          req.flash('error', "id chủ đề không hợp lệ!")
          res.redirect("/topics");
      } else {
        songs = await Song.find({
          status: "active",
          topicId: id,
          deleted: false
        });
      }
    } else if (keyword) {
        const keywordRegex = new RegExp(keyword, 'i');

        //Tạo slug không dấu có dấu trừ ngăn cách
        const slug = convertToSlug(keyword);
        const slugRegex = new RegExp(slug, 'i');

        songs = await Song.find({
            $or: [
                { title: keywordRegex },
                { slug: slugRegex }
            ],
            deleted: false
        })
    }
  } else {
    songs = await Song.find({
      status: "active",
      deleted: false,
    });
  }

  const topics = await Topic.find({
    status: "active",
    deleted: false
  }).select("title")
  
  res.json({
    code: 200,
    topics: topics,
    topic: topic || null,
    songs: songs || [],
  });
};