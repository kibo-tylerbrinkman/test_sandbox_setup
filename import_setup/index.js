const client = require('mozu-node-sdk/clients/platform/application')()
const tenantHelper = require('mozu-node-sdk/clients/platform/tenant')(client)
const csvtojson = require('csvtojson')
const converter = require('json-2-csv')
const {wait} = require('../import_product_data/helpers')
let JSZip = require('jszip')
fs = require('fs')

async function getTenantName(){
	const tenantId = client.context.tenant
	try{
		const tenantInfo = await tenantHelper.getTenant({tenantId})
		
		return tenantInfo.masterCatalogs[1].name
	}catch(e){
		console.log(e)
	}

}

// async function updateCatalogName(file, name){
// 	console.log('IN UPDATE CATALOG NAME', file)
// 	const file_json = await csvtojson().fromFile(`./mystic_catalog/product_data/${file}`)

// 	const updated = file_json.map(f => {
// 		if(f.hasOwnProperty('MasterCatalogName')){
// 			f.MasterCatalogName = name
// 		}

// 		if(f.hasOwnProperty('CatalogName')){
// 			f.CatalogName = name
// 		}
// 		return f
// 	})

// 	converter.json2csv(updated, (err, csv) => {
// 		if(err){
// 			console.log(err)
// 		}
// 		fs.writeFileSync(`./tmp/${file}`, csv, 'utf-8', err => {
// 			console.log('ERRR', file)
// 			console.log(err)
// 		})
// 		console.log('wrote file - ', file)
// 	})




// }

async function updateCatalogName(file, name){
	const file_json = await csvtojson().fromFile(`./mystic_catalog/product_data/${file}`)
	const updated = file_json.map(f => {
		if(f.hasOwnProperty('MasterCatalogName')){
			f.MasterCatalogName = name
		}

		if(f.hasOwnProperty('CatalogName')){
			f.CatalogName = name
		}
		return f
	})
    try {
        await new Promise((resolve, reject) => {
            converter.json2csv(updated, (err, csv) => {
                if(err){
                    console.log(err)
                    reject(err)
                }
                fs.writeFile(`./tmp/${file}`, csv, 'utf-8', err => {
                    if (err) {
                        console.log('ERRR', file)
                        console.log(err)
                        return reject(err)
                    }
                    console.log('wrote file - ', file)
                    resolve()
                })
            })
        })
    } catch (error) {
        console.log(error)
    }
}

async function updateImportFiles(name) {
	const files = await fs.readdirSync('./mystic_catalog/product_data')

	console.log(files)

	if(!fs.existsSync('./tmp')){
		await fs.mkdirSync('./tmp')
	}

	const store = []

	for(let file of files){
		store.push(updateCatalogName(file,name))
	}

	await Promise.all(store)
}

async function generateImportZip(name){
	await updateImportFiles(name)
	console.log('Updated import files')

	const updated = fs.readdirSync('./tmp')
	
	const zip = new JSZip()
	for(let file of updated){
		try{
			zip.file(file, fs.readFileSync(`./tmp/${file}`))
			console.log(`zipping ${file}`)
		} catch(e){
			console.log(e)
		}
	}

	await zip.generateAsync({ type: "nodebuffer" })
		.then(function(content) {
			fs.writeFileSync("./tmp/import.zip", content, function(err) {
			if (err) throw err;
			console.log("File saved!");
			});
  	}).catch(function(e){
		console.log(e)
	})

}

module.exports = {getTenantName, generateImportZip}