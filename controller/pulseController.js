import PulseModel from "../models/Pulse";

export const get_pulse = async (req, res) => {
    try{
            const pulse = await PulseModel.find()

        res.status(200).json({pulse})
}
catch(err){
    res.status(500).json({...err})
}
}