const MASTER_DATA_ENDPOINT = "/master-data";
const PROVINCE_ENDPOINT = "/province"
const WARD_ENDPOINT = "/ward"
const DISTRICT_ENDPOINT = "/district"
const GnhApiInstance = require("../utils/axiosBase").getGhnApiInstance();

const getProvince = (req, res) => {
    GnhApiInstance.get(`${MASTER_DATA_ENDPOINT}${PROVINCE_ENDPOINT}`)
    .then((response) => {
        res.status(200).send({
            message: "Get province success",
            data: response.data.data
        });
    },).catch((error) => {
        res.status(400).send({
            message: "Get province fail",
            data: error.data
        });
    })
}

const getDistrict = (req, res) => {
    const province_id = req.body.province_id;
    const data = { 'province_id': Number.parseInt(province_id)}
    GnhApiInstance.post(`${MASTER_DATA_ENDPOINT}${DISTRICT_ENDPOINT}`, data)
    .then((response) => {
        res.status(200).send({
            message: "Get district success",
            data: response.data.data
        });
    },).catch((error) => {
        res.status(400).send({
            message: "Get district fail",
            data: error.data.message
        });
    })
}

const getWard = (req, res) => {
    const district_id = req.body.district_id;
    console.log("district_id")
    console.log(req.body)
    const data = { 'district_id': Number.parseInt(district_id)}
    GnhApiInstance.post(`${MASTER_DATA_ENDPOINT}${WARD_ENDPOINT}?district_id`, data)
    .then((response) => {
        res.status(200).send({
            message: "Get district success",
            data: response.data.data
        });
    },).catch((error) => {
        res.status(400).send({
            message: "Get district fail",
            data: error.data.message
        });    })
}

module.exports = {
    getProvince,
    getDistrict,
    getWard
}

