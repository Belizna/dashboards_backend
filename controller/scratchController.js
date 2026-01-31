import ScratchModel from "../models/TopsScratch.js"

export const scratch_get = async (req, res) => {
    try {
        var scratch_poster = []
        var scratch_done = 0

        const scratch = await ScratchModel.find()

        const groupScratch = await ScratchModel.aggregate([
            {
                $group: {
                    _id: { category: "$category" },
                    children: {
                        $push: {
                            name: "$name", status: "$status", image_key: "$image_key"
                        }
                    },
                    count: { $sum: 1 }
                }
            }, { $sort: { _id: 1 } }
        ])

        for (var i = 0; i < groupScratch.length; i++) {

            var group = []

            groupScratch[i].children.map(arr => {
                if (arr.status === 'Выполнено') {
                    scratch_done++,
                        group.push({
                            name: arr.name,
                            image_key: arr.image_key,
                        })
                } else {
                    group.push({
                        name: arr.name,
                        image_key: 'https://i.postimg.cc/5YXX8NKY/seryj-fon.png'
                    })
                }
            })

            scratch_poster.push({
                category: groupScratch[i]._id.category,
                card: group,
                count: groupScratch[i].count,
                done: scratch_done,
                key: i + 1
            })

            scratch_done = 0
        }

        res.status(200).json({ scratch, scratch_poster })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const scratch_get_poster = async (req, res) => {
    try {

        var scratch_poster = []
        var scratch_done = 0
        const groupScratch = await ScratchModel.aggregate([
            {
                $group: {
                    _id: { category: "$category" },
                    children: {
                        $push: {
                            name: "$name", status: "$status", image_key: "$image_key"
                        }
                    },
                    count: { $sum: 1 }
                }
            }, { $sort: { _id: 1 } }
        ])

        for (var i = 0; i < groupScratch.length; i++) {

            var group = []

            groupScratch[i].children.map(arr => {
                if (arr.status === 'Выполнено') {
                    scratch_done++,
                        group.push({
                            name: arr.name,
                            image_key: arr.image_key
                        })
                }
                else {
                    group.push({
                        name: arr.name,
                        image_key: 'https://yandex-images.clstorage.net/1y0H03t15/f20141HGPT9F/9u6ozRVXNSP29sE4V_UBw5x1I1E0uxuAU78gPQeyo7b3wiopeSojkFH_UQIWuL3gJpY8_qmXbigNlSZAsqi-FcK6bKkEgqBHtwOBuGelIBZIRDKUlP7KJHaKsBghdCHxddGNumvtdHLwWkTHw_x5NALQ_yqN4H_eenOQF5CPPxblPPtc0cT3oNEUMHglxMFX74bTdzRdajLXz3fckaWiw7VjDzrbDdfBY2kGtSP8bMQR4XxfvaDu_2ui0EXDney1FV-7TtAUt8JAVtNpx8ex14600Qb1Hbtwhr_GLdLEgrHH4M34GY_2MiLaFwdhHU_lQ6Jsri5yn1xrAaPUIa-cF4dOWPwRRnWCcoYTyufGQxWsREBm1m-bcQVt536ylpGzlUIvy5jttIGwy2WGgN1O15MSD78scKwtOPEwx7HurwWGj4ids0X30pDGUYiXZTN23QWwtRWOGaEnHyVtUPbi8abhL9orj0bAoPlVZXINTkSzMG5tHNIfXgggUTXw7U-31y4KngLnx_KTZvO7lXZC1xwlwPZXTItQdz8FHCHUkVIGUC452a8mkIMLV3fwn091E3AtX6yzfn8KkuNnAW1sVTfNy9zzNtfzkFWTOfVHEnettiLF5034kAdv1T2xtLGzt-L8G5oflUGRSRdHMixvNVPRvs4-QW6MWkDRBdBPDUb33MssgcRmY6Dm0Epn9-D1bxdSVlcvufD0fFevgZTAowfgHWuK76WxcGoUBwLe7SUQ08wf7NHsLNpjoNYj_gzU9WxbXwN0R9PCxwIqJwZC9a3FwEUHLdmgdVxlf6O0gtDEgJ2q2y_WEqJpBQTgvu7EYTP-T97znw37oYDFAp9ONyWcys0A9mUD4JVjeTb1kgR_50Elt4_rYQdMRl4h5UERJxDuW4oel3KRaDW2ERxch9IQTiwtsZ48KZIxtwBfvweHDcrcwLSn8oG2IUm1JvLWPTRhlzdMiTLU7ZZ8M'
                    })
                }
            })

            scratch_poster.push({
                category: groupScratch[i]._id.category,
                card: group,
                count: groupScratch[i].count,
                done: scratch_done
            })

            scratch_done = 0
        }


        res.status(200).json({ scratch_poster })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const scratch_add = async (req, res) => {
    try {
        const scratchDoc = new ScratchModel({
            name: req.body.name,
            status: req.body.status,
            category: req.body.category,
            image_key: req.body.image_key,
        })

        const scratch = await scratchDoc.save()

        res.status(200).json({ scratch })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const scratch_edit = async (req, res) => {
    try {

        const comics_edit = await ScratchModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            status: req.body.status,
            category: req.body.category,
            image_key: req.body.image_key,
        })

        res.status(200).json({
            comics_edit,
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const scratch_delete = async (req, res) => {
    try {
        const deleteScratch = await ScratchModel.findByIdAndDelete(req.params.id)
        if (!deleteScratch) {
            return res.status(404).send({
                message: 'Такого комикса нет'
            })
        }
        res.status(200).json({ deleteScratch })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}