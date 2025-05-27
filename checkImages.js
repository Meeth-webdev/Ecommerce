import mongoose from "mongoose"
import fs from "fs"
import path from "path"


const MONGO_URI = 'mongodb+srv://Meeth:meethkajal123@projects.sz2w1jh.mongodb.net/?retryWrites=true&w=majority&appName=Projects'

const productSchema = new mongoose.Schema({
  product: String,
  images: [String],
})

const Product = mongoose.model('Product', productSchema,'custom_products')

async function checkImages() {
  await mongoose.connect(MONGO_URI)
  const products = await Product.find()

  const publicDir = path.join(process.cwd(), 'public')
  let totalMissing = 0
  let totalChecked = 0

  products.forEach((product) => {
    let missingForThisProduct = 0

    product.images.forEach((imgPath) => {
      totalChecked++
      const fullPath = path.join(publicDir, imgPath)
      if (!fs.existsSync(fullPath)) {
        console.warn(`❌ Missing: ${product.product} → ${imgPath}`)
        missingForThisProduct++
        totalMissing++
      }
    })

    if (missingForThisProduct === 0) {
      console.log(`✅ All images found for: ${product.product}`)
    }
  })

  console.log(`\n📊 Finished checking ${totalChecked} images.`)
  console.log(totalMissing === 0 
    ? `🎉 All images are present!` 
    : `⚠️ ${totalMissing} images are missing!`)

  mongoose.disconnect()
}

checkImages().catch(console.error)