const WISHLIST_KEY = "binkeyit_wishlist";

const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

export const isInWishlist = async (productId) => {
  return getWishlist().some((item) => item._id === productId);
};

export const toggleWishlistItem = async (product) => {
  const items = getWishlist();
  const index = items.findIndex((item) => item._id === product._id);

  if (index >= 0) {
    items.splice(index, 1);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    return { added: false };
  }

  items.push(product);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  return { added: true };
};
