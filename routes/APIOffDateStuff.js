const StuffBusyTemp = require('../Models/OffDateStuff');
const offDateStuff = StuffBusyTemp.OffDateStuff;

const fs = require('fs');


module.exports.findOffDate = async (req, res) => {
    const findOffDateStaff = await offDateStuff.find({cmnd : req.params.cmnd});

    res.json(findOffDateStaff);
}

module.exports.addOffDate = async (req, res) => {
    const findOffDateStaff = await offDateStuff.find(
        {
            cmnd : req.body.cmnd,
            ngay : req.body.ngay
        }
    );

    if (findOffDateStaff.length == 0) {
        const createOffDateStaff = await offDateStuff.create(
            {
                cmnd : req.body.cmnd,
                ngay : req.body.ngay,
                loai : req.body.loai
            }
        );

        res.json(createOffDateStaff);
    }
    else {
        const updateOffDateStaff = await offDateStuff.updateOne(
            {
                cmnd : req.body.cmnd,
                ngay : req.body.ngay
            },
            { loai : req.body.loai }
        );
        
        updateOffDateStaff[0].loai = req.body.loai;
        res.json(updateOffDateStaff[0]);
    }
}

module.exports.deleteOffDate = async (req, res) => {
    const removeOffDateStaff = await offDateStuff.deleteOne({_id : req.params._id});

    if (removeOffDateStaff) {
        res.send({success:true}); 
    }
    res.send({success:false}); 
};

module.exports.findOffDateForComputeSalary = async (cmndTemp) => {
    const findOffDateStaff = await offDateStuff.find({cmnd: cmndTemp});
    res.json(findOffDateStaff);
}
