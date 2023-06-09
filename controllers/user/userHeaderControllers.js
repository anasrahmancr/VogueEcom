const Cart = require('../../models/cart')
const Wishlist = require('../../models/wishlist')

module.exports = {
    headCartCount: async (req, res) => {
        const user = req.params.id;
        try {
          const cart = await Cart.findOne({ user_id: user });
          if (cart) {
            const itemCount = cart.items.length; 
            res.status(200).json({ count: itemCount });
          } else {
            res.status(200).json({ count: 0 });
          }
        } catch (error) {
          res.status(500).json({ error: 'An error occurred while fetching the cart.' });
        }
      }, 
      
      headWishlistCount: async (req, res) => {
        const user = req.params.id;
        try {
          const wishlist = await Wishlist.findOne({ userId: user });
          if (wishlist) {
            const itemCount = wishlist.items.length; 
            res.status(200).json({ count: itemCount });
          } else {
            res.status(200).json({ count: 0 });
          }
        } catch (error) {
          res.status(500).json({ error: 'An error occurred while fetching the cart.' });
        }
      },
}
