class Product < ApplicationRecord
 
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
end