import User from '../models/user.model.js'
import Product from '../models/product.model.js'
import { log } from '../utils/logger.js'
import Cart from '../models/cart.model.js'

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body
    const userId = req.user._id

    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({ userId, items: [] })
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.items.push({ productId, quantity: 1 })
    }

    await cart.save()
    res.status(200).json(cart.items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Remove product from cart
export const removeAllFromCart = async (req, res) => {
  try {
    const userId = req.user._id
    const { id: productId } = req.params

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    let cart = await Cart.findOne({ userId })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    )

    await cart.save()
    res.json(cart.items)
  } catch (error) {
    log('Error removing all from cart:', error.message)
    res.status(500).json({ message: 'server error', error: error.message })
  }
}

// Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params
    const { quantity } = req.body
    const userId = req.user._id

    let cart = await Cart.findOne({ userId })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    )

    if (existingItem) {
      if (quantity === 0) {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        )
      } else {
        existingItem.quantity = quantity
      }
      await cart.save()
      return res.json(cart.items)
    } else {
      res.status(404).json({ message: 'Product not found in cart' })
    }
  } catch (error) {
    log('Error updating cart item quantity:', error.message)
    res.status(500).json({ message: 'server error', error: error.message })
  }
}

// Get cart products
export const getCartProducts = async (req, res) => {
  try {
    const userId = req.user._id
    let cart = await Cart.findOne({ userId })
    if (!cart) return res.json([])

    const productIds = cart.items.map((item) => item.productId)

    const products = await Product.find({ _id: { $in: productIds } })
    const cartItems = products.map((product) => {
      const item = cart.items.find(
        (cartItem) => cartItem.productId.toString() === product._id.toString()
      )
      return { ...product.toJSON(), quantity: item.quantity }
    })

    res.json(cartItems)
  } catch (error) {
    log('Error getting cart products:', error.message)
    res.status(500).json({ message: 'server error', error: error.message })
  }
}
