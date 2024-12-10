const productModel = require("../models/productModel"); // Import model sản phẩm
const cloudinary = require('cloudinary').v2;
const constants = require("../utils/constants");
const categoryModel = require("../models/categoryModel");
const productVariationModel = require("../models/productVariationModel");
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const getProduct = async (req, res) => {
  const pageNumber = req.query.pn;
  const searchKey = req.query.sk;
  const category = req.query.category;
  const limit = req.query.limit
  const pageSize = limit ? limit : constants.CONST_PRODUCT_PER_PAGE;
  const skip = (pageNumber - 1) * pageSize;
  let searchModel = searchKey !== '' &&  searchKey !== undefined
      ? {name: { $regex: '.*' + searchKey + '.*' }} 
      : {}
  if (category !== "" && category !== undefined) {
      const isExistCategory = await categoryModel.findOne({name: category}).exec();
      if(isExistCategory) {
          searchModel.categoryId = isExistCategory.id
      }    
  }
  let total = await productModel.countDocuments();
  let totalItems = await productModel.find(searchModel).skip(skip).limit(pageSize).populate("categoryId").populate("rate").exec();

  const totalPage = Math.ceil(total / pageSize);
  const data = {
      totalItems: total,
      totalPage: totalPage,
      currentPage: pageNumber,
      items: totalItems
  }
  res.status(200).send({
      message: 'Get product success',
      data: data
  })
}

const getDetail = async (req, res) => {
  const productId = req.params.id;
  const isExistProduct = await productModel.findById({_id: productId}).populate("categoryId").populate("rate").exec(); 
  if (isExistProduct) {
      res.status(200).send({
          message: 'Get product success',
          data: isExistProduct
      })
  } else {
      res.status(400).send({
          message: 'This product is not available'
      })
  }
}

const createProduct = async (req, res) => {
  try {
    console.log(req)
    const { name, price, isAvailable, quantity, description, categoryId, variations} =
      req.body;
    // Kiểm tra nếu thiếu thông tin cần thiết
    if (!name || !price || !quantity || !description || !categoryId || !isAvailable) {
      return res
        .status(400)
        .json({ message: "Please fill in all necessary fields!" });
    }
    const file = req.files.file[0];
    if (!file) {
      return res.status(400).json({ error: 'Không có tệp được tải lên.' });
    }
    let newProduct = {};
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    cloudinary.uploader.upload(dataUrl, {
        resource_type: 'auto'
    }, async (err, result) => {
      console.log(result)
        if(result) {
          const isExistProduct = await productModel.findOne({name: name}).exec();
          if (!isExistProduct) {
            newProduct = new productModel({
              name,
              price,
              isAvailable,
              quantity,
              description,
              categoryId,
              image: result.secure_url
            });
            await productModel.create(newProduct);

             // Regist variation.
            const variationFiles = req.files.variationFiles;
            const variationArray = JSON.parse(variations); 
            for(var i = 0; i < variationArray.length; i++) {
              if (variationFiles[i] === null 
                || variationFiles[i] === undefined) continue;
              const variationImage = variationFiles.find(file => file.name.includes(variationArray[i]._id));
              if (!variationImage) continue;
              const dataUrl = `data:${variationFiles[i].mimetype};base64,${variationFiles[i].buffer.toString('base64')}`;
              const result = await cloudinary.uploader.upload(dataUrl, {resource_type: 'auto'});
              if (result) {
                    const productId = newProduct._id;
                    const variation = variationArray[i];
                    console.log("variation")    
                    console.log(variation)    
                    const isExistedVariation = await productVariationModel
                      .findOne({productId: productId, name: variation.name})
                      .exec();
                    if (!isExistedVariation) {
                      const variationName = variation.name;
                      const variationPrice = variation.price;
                      const variationColor = variation.color;
                      const newVariation = new productVariationModel({
                        productId: productId,
                        name: variationName,
                        price: variationPrice,
                        color: variationColor,
                        image: result.secure_url
                      });
                      newProduct.variations.push(newVariation);
                      console.log("newVariation")
                      console.log(newVariation)
                      await productVariationModel.create(newVariation);   
                    } else {
                      res.status(400).json({
                        message :"Create fail. Product existed"
                      });
                  }
              } 
            }
            res.status(200).json({
              message :"Create product success.",
              data :newProduct
            }); 
          } else {
            res.status(400).json({
              message :"Create fail. Product existed"
            });
          }
        }
        if (err) {
          res.status(400).json({
            message :"Create product fail. Upload image fail"
          });
        }
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error when create new product.",
        error: error.message,
      });
  }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi server khi lấy danh sách sản phẩm.",
        error: error.message,
      });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi server khi lấy thông tin sản phẩm.",
        error: error.message,
      });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, isAvailable, quantity, description, categoryId, image, variations, variationFiles} = req.body;
    console.log("variationFiles.length")
    console.log(variationFiles.length)
    console.log(variationFiles)
    console.log("variationFiles")
    console.log(req.files)
    const file = req.files.filter(file => file.fieldname === 'file')[0];
    console.log("file123")
    console.log(variations)
    //const variationFiles = req.files['variationFiles[]'];
    if (image !== undefined) {
      console.log("without update image")
      const updateModel = { name, price, isAvailable, quantity, description, categoryId, image };
      await productModel.findByIdAndUpdate(
        req.params.id,
        { name, price, isAvailable, quantity, description, categoryId, image }
      );
    await updateVariation(req.files,variationFiles, variations, req.params.id);
    } else {
      console.log("update image")
      if (!file) {
        return res.status(400).json({ error: 'No file was uploaded.' });
      }
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      cloudinary.uploader.upload(dataUrl, {
          resource_type: 'auto'
      }, async (err, result) => {
        console.log(result)
          if(result) {
            const isExistProduct = await productModel.findById(req.params.id).exec();
            if (isExistProduct) {
              isExistProduct.name = name;
              isExistProduct.price = price;
              isExistProduct.isAvailable = isAvailable;
              isExistProduct.quantity = quantity;
              isExistProduct.description = description;
              isExistProduct.categoryId = categoryId;
              isExistProduct.image = result.secure_url;
              await isExistProduct.save();
              await updateVariation(req.files,variationFiles, variations ,isExistProduct._id);
              res.status(200).json({
                message :"Create product success.",
              }); 
            } else {
              res.status(400).json({
                message :"Update fail. Product not existed"
              });
            }
          }
          if (err) {
            res.status(400).json({
              message :"Upload image fail"
            });
          }
      })
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Update product fail",
        error: error.message,
      });
  }
};

const updateVariation = async (reqFile, fileArray, variations, pId) => {
  console.log("update variation:");
  console.log("variations")
  // console.log(variations)
  // console.log("variationFiles")
  // console.log(variationFiles)
  console.log(variations)
  const variationArray = JSON.parse(variations); 
  for(var i = 0; i < variationArray.length; i++) {
    // console.log("variationFiles[i]")
    // console.log(variationFiles[i])
    // if (variationFiles[i] === null 
    //   || variationFiles[i] === undefined) continue;
    const fileIndex = fileArray.findIndex(file => file.fileName.includes(variationArray[i]._id));
    console.log("fileIndex");
    console.log(fileIndex);
    const variationImage = reqFile.find(file => file.fieldname.includes(`variationFiles[${fileIndex}][image]`));
    if (!variationImage) continue;
    const dataUrl = `data:${variationImage.mimetype};base64,${variationImage.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUrl, {resource_type: 'auto'});
    if (result) {
          const variation = variationArray[i];
          const vid = variation._id;
          console.log("variation_index")    
          console.log(variation)    
          const isExistedVariation = 
            mongoose.isValidObjectId(vid) 
            ? await productVariationModel
              .findById(vid)
              .exec() 
            : null;
          if (!isExistedVariation) {
            const variationName = variation.name;
            const variationPrice = variation.price;
            const variationColor = variation.color;
            console.log("newVariation")
            const newVariation = new productVariationModel({
              productId: pId,
              name: variationName,
              price: variationPrice,
              color: variationColor,
              image: result.secure_url
            });
            console.log("newVariation")
            console.log(newVariation)
            await productVariationModel.create(newVariation);   
          } else if(isExistedVariation)  {
            console.log("isExistedVariation")
            console.log(isExistedVariation)
            const variationName = variation.name;
            const variationPrice = variation.price;
            const variationColor = variation.color;
            console.log("update")
            const updateVariation ={
              name: variationName,
              price: variationPrice,
              color: variationColor,
              image: result.secure_url
            };
            await productVariationModel.findByIdAndUpdate(isExistedVariation._id,updateVariation);
        }
    } 
  }
}
// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }
    res.status(200).json({ message: "Delete product success!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error when delete product.", error: error.message });
  }
};

const checkProductStock = async (req, res) => {
  try {
    const productId = req.query.pid;
    const quantityAddCart = Number.parseInt(req.query.quantity);
    const isExistProduct = await productModel.findById(productId);
    if (!isExistProduct) {
      return res.status(400).json({ message: "Not found product." });
    }
    if (isExistProduct.quantity !== undefined && isExistProduct.quantity !== null && isExistProduct.quantity >= quantityAddCart) {
      res.status(200).json({ message: "Check quantity product Ok!" });
    } else {
      res.status(400).json({ message: `Not enough product on stock. Only`
      +` ${(isExistProduct.quantity !== undefined && isExistProduct.quantity !== null) ? isExistProduct.quantity : 0}`
      +` product left.`});
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error when delete product.", error: error.message });
  }
};

const getProductVariation = async (req, res) => {
  try {
    const id = req.params.productId;
    const variation = await productVariationModel.find({productId: id}).exec();

    if (variation.length === 0) {
      return res.status(400).json({ message: "No variation founded." });
    }

    res.status(200).json({
      message: "Get variation success.",
      data: variation
    });
  } catch (error) {
    res
    .status(500)
    .json({
      message: "Lỗi server khi lấy thông tin sản phẩm.",
      error: error.message,
    });
  }
};

// Xuất các hàm xử lý để sử dụng trong router
module.exports = {
  getProduct,
  createProduct,
  getDetail,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  checkProductStock,
  getProductVariation
};
