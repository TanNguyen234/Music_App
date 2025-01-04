import { Request, Response } from "express"
import Topic from "../../model/topic.model"
import Song from '../../model/song.model'
import { validateSong } from "../../validates/song.validate"
import { systemConfig } from "../../config/config"

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

export interface CustomRequest extends Request {
    files: any;
    file: any;
    flash: (type: string, message: string) => void;
}

//[POST] /admin/songs/createPost
export const createPost = async (req: CustomRequest, res: Response): Promise<void> =>{
    if(validateSong(req.body)) {
        const newSong = new Song(req.body)
        await newSong.save()
        req.flash('success', 'Tạo bài hát mới thành công')
        res.redirect(`/${systemConfig.prefixAdmin}/songs`)
    } else {
        req.flash('error', 'Dữ liệu không hợp lệ')
        res.redirect('back')
    }
}