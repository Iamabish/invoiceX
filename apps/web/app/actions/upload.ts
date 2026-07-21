'use server'

import cloudinary from '@/lib/cloudinary'

export default async function uploadCloudinary(file: File) {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'InvoiceX/avatars',
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        .end(buffer)
    })

    return {
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    }
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error)

    return {
      success: false,
      error: 'Something went wrong. Please try again in a moment.',
    }
  }
}