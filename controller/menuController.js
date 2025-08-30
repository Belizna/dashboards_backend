import MenuModel from "../models/Menu.js";


export const menu_get = async (req, res) => {
    try {
        const menu = await MenuModel.find()
        var menuFilter = []

        menu.map(arr => {
            if (!arr.children?.length) {
                menuFilter.push({
                    key: arr.key,
                    label: arr.label,
                })
            } else {
                menuFilter.push({
                    key: arr.key,
                    label: arr.label,
                    children: arr.children
                })
            }
        })

        menuFilter.sort((a, b) => a.key - b.key)
        res.status(200).json({
            menuFilter
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}
