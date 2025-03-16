// import archiver from 'archiver';
// import { Parser } from 'json2csv';
// import express from 'express';
// import QRCode from 'qrcode';
// import Product from '../models/Product';

// const router = express.Router();

// // Generate QR Code for a product
// router.get('/export/csv', async (req, res) => {
//   try {
//     const products = await Product.find();
//     const csvFields = ['QR_ID', 'Product_ID', 'SKU', 'BatchNumber', 'ManufactureDate', 'VerificationStatus', 'EncodedURL'];
//     const csvData = products.map((product) => ({
//       QR_ID: product.qr_code_id,
//       Product_ID: product.product_id,
//       SKU: product.sku,
//       BatchNumber: product.batch_number,
//       ManufactureDate: product.manufacture_date,
//       VerificationStatus: product.verification_status,
//       EncodedURL: `https://feiken-auth-app.onrender.com/api/verify?qrId=${product.qr_code_id}`
//     }));
    
//     const parser = new Parser({ fields: csvFields });
//     const csv = parser.parse(csvData);

//     res.setHeader('Content-Disposition', 'attachment; filename="qrcodes.csv"');
//     res.setHeader('Content-Type', 'text/csv');
//     res.send(csv);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// // Export QR Codes to ZIP (Images)
// router.get('/export/zip', async (req, res) => {
//   try {
//     const products = await Product.find();
//     const zip = archiver('zip', { zlib: { level: 9 } });
//     res.setHeader('Content-Disposition', 'attachment; filename="qrcodes.zip"');
//     res.setHeader('Content-Type', 'application/zip');
//     zip.pipe(res);

//     for (let product of products) {
//       const qrCodeData = await QRCode.toDataURL(product.qr_code_id);
//       const base64Data = qrCodeData.replace(/^data:image\/png;base64,/, '');
//       const imgBuffer = Buffer.from(base64Data, 'base64');
//       zip.append(imgBuffer, { name: `${product.qr_code_id}.png` });
//     }

//     zip.finalize();
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// export default router;
