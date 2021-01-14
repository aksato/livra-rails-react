# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'rest-client'
require 'open-uri'
 
photo_path = File.join Rails.root, 'app', 'javascript', 'images', 'photo_store'
books = RestClient.get 'https://www.googleapis.com/books/v1/volumes?q=ruby%20on%20rails&maxResults=15&startIndex=1'
books_array = JSON.parse(books)['items']
FileUtils.mkdir_p photo_path
books_array.each do |book|
    prod = Product.create( title: book["volumeInfo"]["title"],
                    description: book["volumeInfo"]["description"],
                    extension: 'jpg',
                    price: (rand(1000..9900)/100.0).to_s )
    if book["volumeInfo"]["imageLinks"]
        File.open(File.join(photo_path, "#{prod.id}.#{prod.extension}"), "wb") do |file|
            file.write URI.open(book["volumeInfo"]["imageLinks"]["thumbnail"]).read
        end
    end
end