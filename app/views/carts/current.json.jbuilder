json.extract! @cart, :id, :created_at, :updated_at
json.cart_total @cart.total_items
json.url cart_url(@cart, format: :json)
json.line_items @cart.line_items do |line_item|
    json.extract! line_item, :id, :product_id, :cart_id, :quantity, :created_at, :updated_at
    json.product_title line_item.product.title
    json.product_price line_item.product.price
    json.product_photo_path line_item.product.photo_path
    json.product_has_photo line_item.product.has_photo?
end