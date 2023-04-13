
const client = require('mozu-node-sdk/clients/platform/application')()

async function indexCatalog(name) {
  // console.log("Tenant id " + tenant.id);
  console.log("=== Tenant name " + name + " ===");

  let productsResource = require('mozu-node-sdk/clients/commerce/catalog/admin/product')(client)
  let products = await productsResource.getProducts({startIndex: '', pageSize: 200})
  for (let product of products.items) {
    console.log("Updating " + product.productCode)
    //UPdate image here
    try{
      await productsResource.updateProduct({productCode: product.productCode, responseFields: ''}, {body: product})
    } catch(e){
      console.log(e)
    }
  }

}

module.exports = indexCatalog