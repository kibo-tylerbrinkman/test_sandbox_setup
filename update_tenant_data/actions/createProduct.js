const { getCategories } = require('./createCategory');
const apiContext = require("../resources/apiContext")
const productResource = require("mozu-node-sdk/clients/commerce/catalog/admin/product")(apiContext);
const Client = require('mozu-node-sdk/client');
const constants = Client.constants;

const productTypeFactory =  Client.sub({
	getProductTypes: Client.method({
		method: constants.verbs.GET,
		url: '{+tenantPod}api/commerce/catalog/admin/attributedefinition/producttypes'
	})
});

const productTypeResource = productTypeFactory(apiContext);

const getProductTypes = async () => {
	try {
		let newProductTypeIds = {}
		const productTypes = await productTypeResource.getProductTypes();	
		for (let i of productTypes.items){
			newProductTypeIds[i.name] = i.id;
		}	
		return newProductTypeIds;
	} catch (error) {
		console.log(error);
	}
}

const createProduct = async (row, productTypeIdToName, categoryIdToName) => {
	try {
		const body = JSON.parse(row.data);

		const newProductTypes = await getProductTypes();

		// Link the product type name to the newly created producty type ID 
		const oldProductTypeId = body.productTypeId;
		const nameOfProductType = productTypeIdToName[String(oldProductTypeId)];
		const updatedProductTypeId = newProductTypes[nameOfProductType];

		const newCategoryIds = await getCategories();

		// Link the category name to the newly created category ID 
		const oldCategoryIds = body.productInCatalogs[0].productCategories.map(id=> id.categoryId);
		const nameOfCategory = oldCategoryIds.map(id=> categoryIdToName[id]);
		const updatedCategoryIds = nameOfCategory.map(name=> ({ categoryId: newCategoryIds[name] }));

		body.productInCatalogs.forEach(catalog => {
			catalog.content.productImages.forEach(productImage => {
				productImage.altText = catalog.content.productName;
				productImage.imageUrl = `http://cdn-sb.mozu.com/28753-46848/cms/46848/files/${productImage.cmsId}`;
				delete productImage.cmsId;
			})	
			body.productTypeId = updatedProductTypeId;
			body.content.productImages = catalog.content.productImages;
			catalog.productCategories = updatedCategoryIds;
		});

		await productResource.addProduct({}, { body })
		console.log(`Product: ${body.productInCatalogs[0].content.productName} was added witih product code: ${body.productCode}`)

	} catch (error) {
		console.log(error.status)	
		console.log(error.url)
		console.log(error.message)	
		console.log('-------------------------------------------------------------------------------------')	
	}
}

module.exports = createProduct;