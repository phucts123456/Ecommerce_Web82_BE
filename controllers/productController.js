const productModel = require("../models/productModel"); // Import model sản phẩm
const cloudinary = require('cloudinary').v2;
const constants = require("../utils/constants");

const getProduct = async (req, res) => {
  const pageNumber = req.query.pn;
  const searchKey = req.query.sk;
  const category = req.query.category;
  const limit = req.query.limit
  const pageSize = limit ? limit : constants.CONST_PRODUCT_PER_PAGE;
  const skip = (pageNumber - 1) * pageSize;
  let searchModel = searchKey !== '' &&  searchKey !== undefined
      ? {name: { $regex: '.*' + searchKey + '.*' }, isAvailable: true} 
      : {isAvailable: true}
  if (category !== "" && category !== undefined) {
      const isExistCategory = await categoryModel.findOne({name: category}).exec();
      if(isExistCategory) {
          searchModel.categoryId = isExistCategory.id
      }    
  }
  let total = await productModel.countDocuments();
  let totalItems = await productModel.find(searchModel).skip(skip).limit(pageSize).populate("categoryId").populate("rate").exec();

  const totalProduct = totalItems.length; 
  const totalPage = Math.ceil(totalProduct / pageSize);
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
    const { name, price, isAvailable, quantity, description, categoryId, } =
      req.body;
    // Kiểm tra nếu thiếu thông tin cần thiết
    if (!name || !price || !quantity || !description || !categoryId || !isAvailable) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin sản phẩm!" });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Không có tệp được tải lên.' });
    }

    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    cloudinary.uploader.upload(dataUrl, {
        resource_type: 'auto'
    }, async (err, result) => {
      console.log(result)
        if(result) {
          const isExistProduct = await productModel.findOne({name: name}).exec();
          if (!isExistProduct) {
            const newProduct = new productModel({
              name,
              price,
              isAvailable,
              quantity,
              description,
              categoryId,
              image: result.secure_url
            });
            await productModel.create(newProduct);
            res.status(201).json({
              message :"Update product success",
              data: newProduct
            });
          } else {
            res.status(400).json({
              message :"Create fail. Product existed",
              data: newProduct
            });
          }
        }
        if (err) {
          res.status(201).json({
            message :"create product fail. Upload image fail"
          });
        }
    })

    
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
    const { name, price, isAvailable, quantity, description, categoryId, image } = req.body;


    const file = req.file;
    if (image !== undefined) {
      const updateModel = { name, price, isAvailable, quantity, description, categoryId, image };
      await productModel.findByIdAndUpdate(
        req.params.id,
        { name, price, isAvailable, quantity, description, categoryId, image }
      );
      return res.status(200).json({message:"Update product success", data: updateModel });
    } else {
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
              res.status(201).json({
                message :"Update product success",
                data: isExistProduct
              });
            } else {
              res.status(400).json({
                message :"Update fail. Product not existed"
              });
            }
          }
          if (err) {
            res.status(201).json({
              message :"create product fail. Upload image fail"
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

// Xuất các hàm xử lý để sử dụng trong router
module.exports = {
  getProduct,
  createProduct,
  getDetail,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
