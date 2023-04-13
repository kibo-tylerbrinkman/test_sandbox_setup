
let importExportFactory = require('./importExportFactory')
let helpers = require('./helpers')
const JSZip = require("jszip")
const fs = require("fs")

async function importJob(){

     let importExportResource = importExportFactory()
     // First we upload the file
     let filename = "catalog.zip"

     let fileResponse = await importExportResource.uploadFile({
          filename: filename
     }, {
          body: fs.readFileSync("./tmp/import.zip"),
          headers: { 'Content-Type': "application/zip" }
     });
     
     console.log(fileResponse)

     console.log({
          "id": fileResponse.id,
          "locationType": fileResponse.locationType,
          "fileName": filename,
          "fileType": "import"
     })

     let importJob = await importExportResource.createImportJob({}, {
          body: {
               "name": "Catalog Import Job Test",
               "format": "Legacy",
               "domain": "catalog",
			   //TODO: need this for images
               // "contextOverride": {
               //      "locale": "en-US",
               //      "currency": "USD",
               //      "masterCatalog": 1,
               //      "catalog": 1,
               //      "site": 60119
               // },
               files: [fileResponse],
               "resources": [ 
                    "AttributeValues",
                    "Attributes",
                    "Categories",
                    "CategoryImages",
                    "Images",
                    // "LocationInventory",
                    // "LocationTypes",
                    // "Locations",
                    // "PricelistEntries",
                    // "PricelistEntryExtras",
                    // "PricelistEntryPrices",
                    // "Pricelists",
                    "ProductBundles",
                    "ProductCatalog",
                    "ProductExtras",
                    // "ProductImages",
                    // "ProductOptionLocalization",
                    "ProductOptions",
                    // "ProductPropertyLocale",
                    // "ProductRanking",
                    "ProductTypeAttributeValues",
                    "ProductTypeAttributes",
                    "ProductTypes",
                    "Products",
                    // "SortDefinition"
               ].map((e) => { return { "format": "Legacy", "resource": e, "deleteOmitted": false } })
          }
     })

     let jobId = importJob.id
     var jobStatus = {}
     while (true) {
          jobStatus = await importExportResource.getImport({ id: jobId })
          console.log(jobStatus)
          if (jobStatus.isComplete == true) {
               break;
          }
          console.log("Waiting...")
          await helpers.wait(2000)
     }

     console.log("Complete!")
}

module.exports = importJob
//importJob()