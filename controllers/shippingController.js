const MASTER_DATA_ENDPOINT = "/master-data";
const PROVINCE_ENDPOINT = "/province"
const WARD_ENDPOINT = "/ward"
const DISTRICT_ENDPOINT = "/district"
const API_VERSION_V2 = "/v2"
const GET_SHIPPING_ORDER_ENDPOINT = "/shipping-order";
const GET_FEE_ENDPOINT = "/fee";
const GET_AVAILABLE_SERVICES_ENDPOINT = "/available-services";
const GnhApiInstance = require("../utils/axiosBase").getGhnApiInstance();
const ShopModel = require("../models/ShopModel");
const config = require("dotenv").config({ path: ".env" });
const DEFAULT_SHOP = process.env.DEFAULT_SHOP;

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
    const province_id = req.query.provinceId;
    if (province_id === undefined)         
    res.status(400).send({
        message: "Get district fail. Please specify provinceId"
    });
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
            data: error.data
        });
    })
}

const getWard = (req, res) => {
    const district_id = req.query.districtId;
    if (district_id === undefined)         
    res.status(400).send({
        message: "Get ward fail. Please specify districtId"
    });
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
            data: error
        });    
    })
}

const getShippingFeeForCart = async (req, res) => {
    const {userAddress, shopIds} = req.body;
    const {userId, districtId, wardCode} = userAddress;
    const shopShippingsFee = [];
    for (const shopId of shopIds) {
        const shopData = await ShopModel.findById(shopId).exec(); 
        if (shopData) {
            const requestServiceData = {
                "shop_id":Number.parseInt(DEFAULT_SHOP),
                "from_district": districtId,
                "to_district": shopData.districtId
            }
            const serviceResponse = await GnhApiInstance.post(
                `${API_VERSION_V2}${GET_SHIPPING_ORDER_ENDPOINT}${GET_AVAILABLE_SERVICES_ENDPOINT}`,
                requestServiceData);
            let defaultService = 0;
            if (serviceResponse.data 
                && serviceResponse.data.code === 200
                && serviceResponse.data.data) {
                    defaultService = serviceResponse.data.data[0].service_id;
            } else {
                return res.status(400).send({
                    message: "Get fee fail. We not support to ship to your address.",
                }); 
            }
            const requestFeeData = {
                "from_district_id": shopData.districtId,
                "from_ward_code": shopData.wardId,
                "service_id":defaultService,
                "service_type_id":null,
                "to_district_id":districtId,
                "to_ward_code":wardCode,
                "height":50,
                "length":20,
                "weight":200,
                "width":20,
                "insurance_value":10000,
                "cod_failed_amount":2000,
                "coupon": null,
                "items": []
            }
            const response = await GnhApiInstance.post(`${API_VERSION_V2}${GET_SHIPPING_ORDER_ENDPOINT}${GET_FEE_ENDPOINT}`, requestFeeData);
            if (response.data && response.data.code === 200) {
                shopShippingsFee.push({
                    shopId: shopData._id,
                    fee: response.data.data.total
                })
            }
        }             
    }
    if (shopShippingsFee.length > 0) {
        return res.status(200).send({
            message: "Get fee success",
            data: {
                userAddress: userAddress,
                shopShippingsFee: shopShippingsFee
            }
        }); 
    } else {
        return res.status(400).send({
            message: "Get fee fail",
        }); 
    }
}

module.exports = {
    getProvince,
    getDistrict,
    getWard,
    getShippingFeeForCart
}

