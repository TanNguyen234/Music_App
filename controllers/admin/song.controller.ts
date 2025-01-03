import { Request, Response } from "express"
import Topic from "../../model/topic.model"
import Song from '../../model/song.model'
import { validateTopic } from "../../validates/validate-topic.validate"

//[GET] /admin/songs
export const index = async (req: Request, res: Response): Promise<void> => {
    const songs = await Song.find({
        deleted: false
    })

    res.render('admin/pages/songs/index', {
        pageTitle: 'Trang bài hát',
        songs: songs || []
    })
}

//[GET] /admin/songs/create
export const create = async (req: Request, res: Response): Promise<void> =>{
    const topics = await Topic.find({
        deleted: false
    })
    res.render('admin/pages/songs/create', {
        pageTitle: 'Tạo bài hát mới',
        topics: topics || []
    })
}