import PersonModel from "../models/Person.js";

export const person_get = async (req, res) => {
    try {

        var groupPerson = []

        const personClass = await PersonModel.aggregate([
            {
                $group: {
                    _id: "$id",
                    children: { $push: "$children.id" },
                }
            }
        ])

        for (var i = 0; i < personClass.length; i++) {
            var massPerson = []
            personClass[i].children.map(pers => {
                pers.map(p => massPerson.push({ value: p, label: p }))
            })

            groupPerson.push({
                id: personClass[i]._id, person: massPerson
            })
        }

        const person = await PersonModel.find()

        var personTree = []

        person.map(arr => personTree.push({ id: arr.id, value: arr.value, children: arr.children }))

        var personSelectorOptions = []
        var personSelectorClass = []

        for (var i = 0; i < person.length; i++) {
            personSelectorOptions.push({ value: i, label: person[i].id })
            personSelectorClass.push({ value: person[i].id, label: person[i].id })
        }

        personSelectorOptions.sort((a, b) => (a.label > b.label) - (a.label < b.label))

        res.status(200).json({
            personTree,
            personSelectorOptions,
            personSelectorClass,
            groupPerson
        })
    }
    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const person_add_class = async (req, res) => {
    try {

        var arr = []

        for (var i = 0; i < req.body.names.length; i++) {
            var values = {
                title: req.body.names[i]
            }
            arr.push({ id: req.body.names[i], value: values })
        }

        PersonModel.insertMany(arr)

        res.status(200).json({
            arr
        })
    }

    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const person_add_person = async (req, res) => {
    try {

        var arr = [req.body]

        for (var i = 0; i < arr[0].items.length; i++) {

            for (var j = 0; j < arr[0].items[i].list.length; j++) {

                var group = {
                    id: arr[0].items[i].list[j].first,
                    value: {
                        title: arr[0].items[i].list[j].first,
                        items: [{
                            text: arr[0].items[i].list[j].second,
                        }]
                    },
                    children: []
                }
                await PersonModel.updateOne({ id: arr[0].items[i].name }, { $addToSet: { children: group } })
            }
        }

        res.status(200).json({
            arr
        })
    }

    catch (err) {
        res.status(500).json({ ...err })
    }
}

export const person_add_books = async (req, res) => {
    try {

        var arr = [req.body]

        for (var i = 0; i < arr[0].items.length; i++) {
            for (var m = 0; m < arr[0].items[i].list.length; m++) {
                var books = {
                    id: self.crypto.randomUUID(),
                    value: {
                        title: arr[0].items[i].list[m].first
                    }
                }
                await PersonModel.updateOne({ id: arr[0].items[i].name, children: { $elemMatch: { id: arr[0].items[i].person } } }, { $addToSet: { "children.$.children": books } })

            }
        }
        res.status(200).json({
            arr
        })
    }

    catch (err) {
        res.status(500).json({ ...err })
    }
}