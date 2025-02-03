import { Request, Response } from "express"
import Topic from "../../model/topic.model"
import Song from "../../model/song.model"
import Account from "../../model/account.model"
import User from "../../model/user.model"

//[GET] /admin/dashboard
export const index = async (req: Request, res: Response): Promise<void> => {
    var statistic = {
        topics: {
            total: 0,
            active: 0,
            inactive: 0
        },
        songs: {
            total: 0,
            active: 0,
            inactive: 0
        },
        accounts: {
            total: 0,
            active: 0,
            inactive: 0
        },
        users: {
            total: 0,
            active: 0,
            inactive: 0
        }
    }

    statistic.topics.total = await Topic.countDocuments({
        deleted: false
    })

    statistic.songs.total = await Song.countDocuments({
        deleted: false
    })

    statistic.accounts.total = await Account.countDocuments({
        deleted: false
    })

    statistic.users.total = await User.countDocuments({
        deleted: false
    })

    statistic.topics.active = await Topic.countDocuments({
        deleted: false,
        status: 'active'
    })

    statistic.songs.active = await Song.countDocuments({
        deleted: false,
        status: 'active'
    })

    statistic.accounts.active = await Account.countDocuments({
        deleted: false,
        status: 'active'
    })

    statistic.users.active = await User.countDocuments({
        deleted: false,
        status: 'active'
    })

    statistic.topics.inactive = await Topic.countDocuments({
        deleted: false,
        status: 'inactive'
    })

    statistic.songs.inactive = await Song.countDocuments({
        deleted: false,
        status: 'inactive'
    })

    statistic.accounts.inactive = await Account.countDocuments({
        deleted: false,
        status: 'inactive'
    })

    statistic.users.inactive = await User.countDocuments({
        deleted: false,
        status: 'inactive'
    })

    res.render('admin/pages/dashboard/index', {
        pageTitle: 'Trang Chủ',
        statistic: statistic
    })
}