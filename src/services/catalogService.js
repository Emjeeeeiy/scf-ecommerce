import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db, serverTimestamp } from '../Firebase/Firebase'

const categoriesCollection = collection(db, 'categories')
const productsCollection = collection(db, 'products')
const createPlaceholderImage = (label, background = '#0f172a', foreground = '#ffffff') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="${background}" rx="28" ry="28" />
      <text x="50%" y="47%" text-anchor="middle" fill="${foreground}" font-family="Arial, sans-serif" font-size="40" font-weight="700">
        ${label}
      </text>
      <text x="50%" y="60%" text-anchor="middle" fill="${foreground}" font-family="Arial, sans-serif" font-size="20" opacity="0.8">
        Base64 demo image
      </text>
    </svg>
  `.trim()

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export const listCategories = async () => {
  const snapshots = await getDocs(query(categoriesCollection, orderBy('name')))
  return snapshots.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}

export const createCategory = async (name) => {
  const docRef = await addDoc(categoriesCollection, {
    name,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export const deleteCategory = async (categoryId) => {
  await deleteDoc(doc(db, 'categories', categoryId))
}

export const listProducts = async () => {
  const productSnapshots = await getDocs(query(productsCollection, orderBy('createdAt', 'desc')))

  return Promise.all(
    productSnapshots.docs.map(async (productDoc) => {
      const variantsSnapshot = await getDocs(
        query(collection(db, 'products', productDoc.id, 'variants'), orderBy('size')),
      )

      return {
        id: productDoc.id,
        ...productDoc.data(),
        variants: variantsSnapshot.docs.map((variantDoc) => ({
          id: variantDoc.id,
          ...variantDoc.data(),
        })),
      }
    }),
  )
}

export const getProduct = async (productId) => {
  const productRef = doc(db, 'products', productId)
  const productSnapshot = await getDoc(productRef)

  if (!productSnapshot.exists()) {
    return null
  }

  const variantsSnapshot = await getDocs(
    query(collection(db, 'products', productId, 'variants'), orderBy('size')),
  )

  return {
    id: productSnapshot.id,
    ...productSnapshot.data(),
    variants: variantsSnapshot.docs.map((variantDoc) => ({
      id: variantDoc.id,
      ...variantDoc.data(),
    })),
  }
}

export const createProduct = async ({
  name,
  description,
  studentPrice,
  nonStudentPrice,
  status,
  categoryId,
  base64Image,
  variants,
}) => {
  const productRef = await addDoc(productsCollection, {
    name,
    description,
    studentPrice: Number(studentPrice),
    nonStudentPrice: Number(nonStudentPrice),
    status: status || 'active',
    categoryId: categoryId || null,
    base64Image: base64Image || '',
    createdAt: serverTimestamp(),
  })

  if (variants && variants.length > 0) {
    const batch = writeBatch(db)
    variants.forEach((variant) => {
      const vRef = doc(collection(db, 'products', productRef.id, 'variants'))
      batch.set(vRef, {
        color: variant.color || '',
        size: variant.size || '',
        stock: Number(variant.stock || 0),
      })
    })
    await batch.commit()
  }

  return productRef.id
}

export const updateProduct = async (
  productId,
  { name, description, studentPrice, nonStudentPrice, status, categoryId, base64Image, variants = [] },
) => {
  const productRef = doc(db, 'products', productId)
  await updateDoc(productRef, {
    name,
    description,
    studentPrice: Number(studentPrice),
    nonStudentPrice: Number(nonStudentPrice),
    status: status || 'active',
    categoryId: categoryId || null,
    base64Image: base64Image || '',
  })

  const variantsRef = collection(db, 'products', productId, 'variants')
  const existingVariants = await getDocs(variantsRef)

  const batch = writeBatch(db)
  
  // Delete existing variants
  existingVariants.docs.forEach((variantDoc) => {
    batch.delete(variantDoc.ref)
  })

  // Add new variants
  variants.forEach((variant) => {
    const vRef = doc(variantsRef)
    batch.set(vRef, {
      color: variant.color || '',
      size: variant.size || '',
      stock: Number(variant.stock || 0),
    })
  })

  await batch.commit()
}

export const deleteProduct = async (productId) => {
  const variantsRef = collection(db, 'products', productId, 'variants')
  const variantsSnapshot = await getDocs(variantsRef)
  
  const batch = writeBatch(db)
  variantsSnapshot.docs.forEach((variantDoc) => {
    batch.delete(variantDoc.ref)
  })
  batch.delete(doc(db, 'products', productId))
  
  await batch.commit()
}

export const ensureDemoCatalog = async () => {
  const categorySnapshots = await getDocs(categoriesCollection)

  if (!categorySnapshots.empty) {
    return
  }

  const womenCategory = await addDoc(categoriesCollection, {
    name: 'Women',
    createdAt: serverTimestamp(),
  })

  const menCategory = await addDoc(categoriesCollection, {
    name: 'Men',
    createdAt: serverTimestamp(),
  })

  const demoProducts = [
    {
      name: 'Essential Linen Set',
      description: 'A breathable two-piece linen outfit designed for warm weather.',
      studentPrice: 1699,
      nonStudentPrice: 1899,
      status: 'active',
      categoryId: womenCategory.id,
      base64Image: createPlaceholderImage('Essential Linen', '#d97706'),
      variants: [
        { color: 'Cream', size: 'S', stock: 6 },
        { color: 'Cream', size: 'M', stock: 8 },
      ],
    },
    {
      name: 'Urban Layer Jacket',
      description: 'A lightweight statement jacket with clean lines and everyday comfort.',
      studentPrice: 2199,
      nonStudentPrice: 2499,
      status: 'active',
      categoryId: menCategory.id,
      base64Image: createPlaceholderImage('Urban Layer', '#1e293b'),
      variants: [
        { color: 'Black', size: 'M', stock: 4 },
        { color: 'Black', size: 'L', stock: 5 },
      ],
    },
  ]

  for (const product of demoProducts) {
    const productRef = await addDoc(productsCollection, {
      name: product.name,
      description: product.description,
      studentPrice: product.studentPrice,
      nonStudentPrice: product.nonStudentPrice,
      status: product.status,
      categoryId: product.categoryId,
      base64Image: product.base64Image || '',
      createdAt: serverTimestamp(),
    })

    await Promise.all(
      product.variants.map((variant) =>
        addDoc(collection(db, 'products', productRef.id, 'variants'), variant),
      ),
    )
  }
}

export const saveCategory = async (categoryId, payload) => {
  await setDoc(doc(db, 'categories', categoryId), payload, { merge: true })
}
