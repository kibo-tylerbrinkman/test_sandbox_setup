const client = require('mozu-node-sdk/clients/platform/application')()
const tenantHelper = require('mozu-node-sdk/clients/platform/tenant')(client)
const csvtojson = require('csvtojson')
const converter = require('json-2-csv')
let JSZip = require('jszip')
fs = require('fs')

async function getTenantName(){
	const tenantId = client.context.tenant
	try{
		const tenantInfo = await tenantHelper.getTenant({tenantId})
		return tenantInfo.name
	}catch(e){
		console.log(e)
	}

}

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

	converter.json2csv(updated, (err, csv) => {
		if(err){
			console.log(err)
		}
		fs.writeFileSync(`./tmp/${file}`, csv, 'utf-8')
		console.log('wrote file')
	})

}

async function updateImportFiles(name) {
	const files = await fs.readdirSync('./mystic_catalog/product_data')

	if(!fs.existsSync('./tmp')){
		await fs.mkdirSync('./tmp')
	}

	for(let file of files){
		await updateCatalogName(file,name)
	}
}

async function generateImportZip(name){
	await updateImportFiles(name)
	console.log('Updated import files')

	const updated = fs.readdirSync('./tmp')

	const zip = new JSZip()
	for(let file of updated){
		zip.file(file, fs.readFileSync(`./tmp/${file}`))
	}

	await zip.generateAsync({ type: "nodebuffer" })
		.then(function(content) {
			fs.writeFileSync("./tmp/import.zip", content, function(err) {
			if (err) throw err;
			console.log("File saved!");
			});
  	});
}

module.exports = {getTenantName, generateImportZip}