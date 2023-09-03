const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		return res.render('products', {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		const product = products.find(product => product.id === +req.params.id)
		return res.render('detail', {
			...product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		return res.render('product-create-form')
	},

	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		const { name, price, discount, description, category, image } = req.body;
		const newProduct = {
			id: products[products.length - 1].id + 1,
			name: name.trim(),
			description: description.trim(),
			price: +price,
			discount: +discount,
			image: req.file ? req.file.filename : null,
			category,
			
		}
		products.push(newProduct)

		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 3), 'utf-8');

		return res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		const product = products.find(product => product.id === +req.params.id)
		return res.render('product-edit-form', {
			...product,
		})
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const { name, price, discount, description, category, image } = req.body

		const productsModify = products.map(product => {

			if (product.id == +req.params.id) {

				req.file && (fs.existsSync(`./public/images/products/${product.image}`) && fs.unlinkSync(`./public/images/products/${product.image}`))

				product.name = name.trim();
				product.description = description.trim();
				product.price = +price;
				product.discount = +discount;
				product.image = req.file ? req.file.filename : product.image;
				product.category = category;
			
			}
			return product
		})
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 3), 'utf-8');

		return res.redirect('/products')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {

		const productsModify = products.filter((product) =>{
			if (product.id === +req.params.id) {
				fs.existsSync(`./public/images/products/${product.image}`) &&
				fs.unlinkSync(`./public/images/products/${product.image}`);
			}

			return product.id !== +req.params.id;
		})

		fs.writeFileSync(productsFilePath,JSON.stringify(productsModify,null,3),'utf-8')
		return res.redirect('/products')
	}
};

module.exports = controller;