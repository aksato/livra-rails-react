class Product < ApplicationRecord
    has_many :line_items
    before_destroy :ensure_not_referenced_by_any_line_item

    def has_photo?
        File.exists? File.join Rails.root, 'app', 'javascript', 'images', 'photo_store', "#{id}.#{extension}"
    end
 
    def photo_path
        if has_photo?
            "media/photo_store/" + "#{id}.#{extension}"
        else
            "media/images/no_image.svg"
        end
    end

    private
        def ensure_not_referenced_by_any_line_item
            unless line_items.empty?
                errors.add(:base, 'Line Items present')
                throw :abort
            end
        end
end