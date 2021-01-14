# PMR3304 - Aplicação Livraria do Laboratório 6 versão 2020

Seguem abaixo as instruções fornecidas para a geração da aplicação da Livraria desenvolvida no Laboratório 6 de PMR3304-2020.

## Capítulo 1 - Criando uma Livraria com Ruby on Rails sem Docker (versão alternativa)
* Pré-requisito: ruby e bundler instalado:
```bash
ruby -v
bundle -v
```
* Executar:
```bash
rails new livra
cd livra
```
### Extra: Instalar o tailwindcss e o font-awesome
* Adicionar o módulo de Node.js do tailwincss e o font-awesome:
```bash
yarn add tailwindcss@npm:@tailwindcss/postcss7-compat @fortawesome/fontawesome-free alpinejs
```
* Adicionar linha no arquivo `postcss.config.js`
```js
// postcss.config.js
let environment = {
  plugins: [
    require('tailwindcss'), // ADD THIS LINE
    ...
```
* Para criar o arquivo de configuração do tailwindcss, execute:
```bash
npx tailwindcss init --full
```
* Crie uma pasta para imagens e CSS no Webpacker com o comando:
```bash
mkdir app/javascript/stylesheets
mkdir app/javascript/images
```
* Criar arquivo `app/javascript/stylesheets/application.css` com o conteúdo:
```css
/* app/javascript/stylesheets/application.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```
* Para incluir o tailwindcss, fon-awesome e images no Webpacker, edite o arquivo `app/javascript/packs/application.js`:
```js
// app/javascript/packs/application.js
...
require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

require("alpinejs"); // ADD THIS LINE
require.context("../images", true); // ADD THIS LINE
import "stylesheets/application"; // ADD THIS LINE
import "@fortawesome/fontawesome-free/js/all"; // ADD THIS LINE
...
```
* Para testar, crie um controller com:
```bash
rails generate controller static index
```
* Edite o arquivo `app/views/static/index.html.erb`:
```html
<!-- app/views/static/index.html.erb -->
<section class="p-4 flex flex-col justify-center items-center" x-data="{ open: false }">
    <button class="w-64 bg-gray-600 text-white rounded-full p-2 hover:bg-gray-500" @click="open = true">Open
        Dropdown</button>

    <ul x-show="open" @click.away="open = false">
        <li class="py-2">Dropdown Item #1</li>
        <li class="py-2">Dropdown Item #2</li>
        <li class="py-2">Dropdown Item #3</li>
        <li class="py-2">Dropdown Item #4</li>
    </ul>
</section>
```
* Inicie o servidor com:
```bash
rails server
```
* Teste acessando <http://localhost:3000/static/index> (deve ter fundo preto e um botão)
* Para reverter a criação do controlador teste, execute:
```bash
rails destroy controller static
```
* Por fim, apague a rota correspondente em `config/routes.rb`:
```ruby
Rails.application.routes.draw do
  # get 'static/index' # DELETE THIS LINE
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
```
### 1.2 Criando uma Tela Básica
* Execute:
```bash
rails generate scaffold Product title:string description:text extension:string price:decimal
rails db:migrate
```
* Para possibilitar a manipulação de imagens, editar o modelo `app/models/product.rb`:
```ruby
# app/models/product.rb
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
```
* Criar arquivo `app/javascript/images/no_image.svg` com:
```svg
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   version="1.1"
   width="130"
   height="180"
   id="svg2">
  <defs
     id="defs6" />
  <rect
     width="129"
     height="179"
     x="0.49999997"
     y="0.49999675"
     id="rect2824"
     style="fill:#ffffff;stroke:#999999;stroke-width:1;stroke-opacity:1" />
  <text
     x="64.648438"
     y="79.863152"
     id="text2818"
     xml:space="preserve"
     style="font-size:16px;font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;text-align:center;text-anchor:middle;fill:#999999;fill-opacity:1;stroke:none;font-family:Sans;-inkscape-font-specification:Andale Mono Bold"><tspan
       x="64.648438"
       y="79.863152"
       id="tspan2820">No image</tspan><tspan
       x="64.648438"
       y="99.863152"
       id="tspan2822">available</tspan></text>
</svg>

```
* Para popular o banco de dados, primeiro edite o arquivo `Gemfile`:
```ruby
# Gemfile
...
group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'rest-client', '~> 2.1' # ADD THIS LINE
  gem 'open-uri', '~> 0.1' # ADD THIS LINE
end
...
```
* Para instalar as gemas, execute:
```bash
bundle install
```
* Edite o arquivo `db/seeds.rb`
```ruby
# db/seeds.rb
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
```
* Finalmente, execute:
```bash
rails db:seed
```
* Antes de mais nada, adicione a seguinte linha no fim do arquivo `.gitignore`
```gitignore
/app/javascript/images/photo_store
```
### 1.5 Incluindo a Loja
* Execute
```bash
rails generate controller store index
```
* E edite `config/routes.rb`:
```rb
# config/routes.rb
Rails.application.routes.draw do
  root to: "store#index" # MODIFY THIS LINE
  resources :products
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
```
* Antes de editar a página principal da loja, vamos configurar o layout geral. Edite o arquivo `app/views/layouts/application.html.erb`:
```html
<!-- app/views/layouts/application.html.erb -->
<!DOCTYPE html>
...
  <%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css?family=Inter&display=swap" rel="stylesheet">
</head>

<body class="flex flex-col h-screen justify-between overflow-y-scroll">
  <%= render 'layouts/navigation' %>
  <main class="w-full max-w-screen-xl mx-auto flex-grow">
    <%= yield %>
  </main>
  <%= render 'layouts/footer' %>
</body>

</html>
```
* Antes de definir as partials, vamos gerar o logo. Para tal, crie o arquivo `app/javascript/images/logo.svg` com:
```svg
<!-- app/javascript/images/logo.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="223.888" height="48" viewBox="0 0 59.237 12.7">
<g fill="#ffffff">
<path d="M11.112 1.588v10.318H1.587a.794.794 0 110-1.587h8.732V0H1.587C.711 0 0 .71 0 1.587v9.525C0 11.99.71 12.7 1.587 12.7h10.32V1.587z"/>
<g style="line-height:1.25;-inkscape-font-specification:Chango" aria-label="Livra" font-size="12.7" font-family="Chango" letter-spacing="0" word-spacing="0" stroke-width=".265">
<path d="M21.256 6.506l-.012 2.54q0 .559.165.838.178.267.724.267h3.213q.584.013.584.889 0 .673-.165.978-.165.305-.673.317-1.791.051-3.544.051-1.752 0-4.47-.025-.457 0-.75-.216-.279-.229-.317-.622-.101-1.105-.101-3.48 0-2.388.05-3.213.064-.838.242-1.105.178-.28.698-.28h3.404q.533 0 .698.28.178.28.216.902.038.622.038 1.88zM27.663 5.91h2.476q.432 0 .572.19.152.19.19.85.05.648.05 2.388 0 1.727-.075 2.439-.038.216-.216.38-.178.166-.635.191-.445.038-1.067.038-.622 0-1.13-.038-.508-.025-.686-.19-.178-.165-.203-.381-.09-.826-.09-2.528 0-1.714.052-2.336.05-.623.19-.813.14-.19.572-.19zm1.371-2.998q.838 0 1.257.343.432.33.432.914 0 1.372-1.829 1.372-.736 0-1.257-.318-.52-.317-.52-.952 0-1.359 1.917-1.359zM31.972 6.341q0-.457.521-.457l2.794-.013q.42 0 .635.127.216.114.381.483l1.181 2.21q.051.152.203.152.153 0 .229-.152l1.22-2.528q.1-.228.279-.266.05-.013.177-.013l1.334-.013q.178 0 .241.165.038.076.038.178 0 .089-.063.203-1.727 3.556-2.832 5.512-.216.33-.686.508-.47.178-1.029.178-1.244 0-1.664-.635-.406-.648-.863-1.473-.457-.826-1.042-1.943-.584-1.118-.914-1.715-.14-.292-.14-.508zM43.041 5.871h2.477q.432 0 .597.19.165.178.165.547v.457q.711-1.346 2.311-1.346.534 0 .877.343.343.343.343.914 0 .572-.305 1.143-.305.559-.851.559-.254 0-.711-.254-.458-.267-.737-.267-.28 0-.584.203-.292.204-.292.673 0 2.045-.076 2.706-.039.215-.216.38-.178.166-.635.204-.445.025-.89.025-.444 0-1.51-.05-.305-.013-.483-.178-.178-.166-.203-.381-.09-.826-.09-2.528t.051-2.324q.051-.635.19-.825.14-.19.572-.19zM55.033 5.668q4.14 0 4.179 2.692.025 1.143.025 2.096 0 .952-.013 1.283-.012.33-.177.482-.153.14-.61.14h-2.692q-.407 0-.56-.14-.152-.152-.164-.444 0-.013-.013-.038v-.064q-.838.864-2.286.864-1.003 0-1.715-.496-.698-.508-.698-1.384 0-.889.495-1.41.508-.533 1.194-.724.699-.19 1.486-.19.8 0 1.562.152v-.05q0-.635-.254-.915-.241-.28-.8-.28-.546 0-.914.102-.369.09-.56.19-.52.306-.723.306-.203 0-.368-.19-.153-.191-.153-.585 0-.406.14-.559.152-.152.47-.305 1.105-.533 3.15-.533zm-.597 5.194q.56 0 .572-.216.025-.419.025-1.105 0-.266-.406-.266t-.66.203q-.254.19-.254.571 0 .381.203.597.216.216.52.216z"/>
</g></g></svg>
```
* Também vamos definir alguns componentes tailwind. Paral tal, edite o arquivo `app/javascript/stylesheets/application.css` com:
```css
// app/javascript/stylesheets/application.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
    .btn {
        @apply bg-gray-600 text-white rounded-full w-full my-2 py-2 hover:bg-gray-500 uppercase flex items-center justify-center;
    }
    .input {
        @apply w-full my-2 px-3 py-2 rounded lg:my-0 lg:mr-2 bg-gray-100;
    }
}
```
* Para criar o partial do cabeçalho, inicialmente crie o arquivo `app/views/layouts/_navigation.html.erb` com o design para tela de celular (*mobile first*):
```html
<!-- app/views/layouts/_navigation.html.erb -->
<header x-data="{ open: false }" class="w-full bg-green-500 text-white">
    <div class="flex items-center justify-between p-4 flex-wrap">
        <!-- Menu Button -->
        <button x-on:click="open = !open">
            <i class="fas fa-bars text-xl hover:text-gray-300"></i>
        </button>

        <!-- Logo -->
        <%= link_to root_path, class: 'hover:bg-transparent' do %>
        <%= image_pack_tag 'media/images/logo.svg', alt: 'A Livraria', class: 'h-6' %>
        <% end %>

        <!-- Cart Icon -->
        <a href="#" class="flex hover:bg-transparent group">
            <i class="fas fa-shopping-cart text-white text-xl group-hover:text-gray-300"></i>
            <span
                class="rounded-full w-4 h-4 -ml-1 -mt-2 self-start flex items-center justify-center bg-red-500 group-hover:bg-red-700 text-white group-hover:text-gray-300">
                <p>0</p>
            </span>
        </a>

        <!-- Navigation -->
        <nav :class="{ 'hidden': !open }" class="w-full">
            <ul>
                <li class="pt-4">Blog</li>
                <li class="pt-4">Perguntas</li>
                <li class="pt-4">Notícias</li>
                <li class="pt-4">Contato</li>
            </ul>
        </nav>
    </div>
</header>
```
* Vamos implementar o design resposivo com o tailwindcss. Edite o arquivo `app/views/layouts/_navigation.html.erb` novamente:
```html
<!-- app/views/layouts/_navigation.html.erb -->
<header x-data="{ open: false }" class="w-full bg-green-500 text-white">
    <div class="p-4 flex items-center justify-between flex-wrap md:max-w-screen-xl md:mx-auto"> <!-- MODIFY THIS LINE -->
        <!-- Menu Button -->
        <button x-on:click="open = !open" class="md:hidden"> <!-- MODIFY THIS LINE -->
            <i class="fas fa-bars text-xl hover:text-gray-300"></i>
        </button>

        ...

        <!-- Cart Icon -->
        <a href="#" class="flex hover:bg-transparent group md:order-last"> <!-- MODIFY THIS LINE -->
          ...
        </a>

        <!-- Navigation -->
        <nav :class="{ 'hidden': !open }" class="w-full md:w-auto md:block"> <!-- MODIFY THIS LINE -->
            <ul>
                <li class="pt-4 md:inline md:px-4">Blog</li> <!-- MODIFY THIS LINE -->
                <li class="pt-4 md:inline md:px-4">Perguntas</li> <!-- MODIFY THIS LINE -->
                <li class="pt-4 md:inline md:px-4">Notícias</li> <!-- MODIFY THIS LINE -->
                <li class="pt-4 md:inline md:px-4">Contato</li> <!-- MODIFY THIS LINE -->
            </ul>
        </nav>
    </div>
</header>
```
* Para criar o partial do footer, crie o arquivo `app/views/layouts/_footer.html.erb` com:
```html
<!-- app/views/layouts/_footer.html.erb -->
<footer class="w-full bg-green-500 text-white p-4 flex flex-col justify-center items-center">
    <ul>
        <li class="inline-block px-1 text-lg">
            <i class="fab fa-facebook hover:text-gray-300"></i>
        </li>
        <li class="inline-block px-1 text-lg">
            <i class="fab fa-twitter hover:text-gray-300"></i>
        </li>
        <li class="inline-block px-1 text-lg">
            <i class="fab fa-instagram hover:text-gray-300"></i>
        </li>
        <li class="inline-block px-1 text-lg">
            <i class="far fa-envelope hover:text-gray-300"></i>
        </li>
        <li class="inline-block px-1 text-lg">
            <i class="fab fa-youtube hover:text-gray-300"></i>
        </li>
    </ul>
    <p class="text-sm pt-4">Copyright ©Livra</p>
</footer>
```
* Agora, para a página principal da loja, primeiro vamos editar o controlador `app/controller/store_controller.rb`:
```rb
# app/controller/store_controller.rb
class StoreController < ApplicationController
  def index
    @products = Product.all
  end
end
```
* Então, edite o arquivo `app/views/store/index.html.erb` com:
```html
<!-- app/views/store/index.html.erb -->
<section class="flex flex-col sm:flex-row sm:flex-wrap">
    <% @products.each do |product| %>
      <div class="w-full sm:self-stretch sm:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col items-center py-8 px-4">
          <!-- Cover Image -->
          <%= link_to product do %><%= image_pack_tag product.photo_path, alt: product.title, class: 'h-64' %><% end %>

          <!-- Title -->
          <%= link_to product.title, product, class: "text-base text-center py-4 sm:flex-grow hover:text-gray-500 hover:bg-transparent" %>

          <!-- Price -->
          <p class="text-xl"><%= sprintf("R$%0.02f", product.price) %></p>
      </div>
    <% end %>
</section>
```

## Capítulo 2 - Carrinho de Compras
* Execute:
```bash
rails generate model Cart
rails db:migrate
```
* Criar controlador com:
```bash
rails generate controller carts show
```
* Modificar `config/routes.rb`
```rb
# config/routes.rb
Rails.application.routes.draw do
  resources :carts, only: :show # MODIFY THIS LINE
  root to: "store#index"
  resources :products
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
```
* Modificar `app/controllers/carts_controller.rb`:
```
# app/controllers/carts_controller.rb
class CartsController < ApplicationController
  def show
    @cart = Cart.find(params[:id])
  end
end
```
* Alterar `app/models/current_cart.rb` com:
```rb
# app/models/current_cart.rb
module CurrentCart
    private
        def set_cart 
            @cart = Cart.find(session[:cart_id])
        rescue ActiveRecord::RecordNotFound
            @cart = Cart.create
            session[:cart_id] = @cart.id
        end
end
```
* Para testar, execute:
```
rails console
irb(main):001:0> Cart.create
irb(main):002:0> exit
```
* Teste acessando <http://localhost:3000/carts/1> (deve aparecer a página padrão do generate controller)
* Por fim, editar `app/controllers/application_controller.rb`:
```rb
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
    before_action :set_cart
    
    private
        def set_cart 
            @cart = Cart.find(session[:cart_id])
        rescue ActiveRecord::RecordNotFound
            @cart = Cart.create
            session[:cart_id] = @cart.id
        end
end
```
### 2.1 Conectando Itens ao Carrinho
* Executar:
```bash
rails generate resource LineItem product:references cart:belongs_to
rails db:migrate
```
* Editar `app/models/cart.rb`:
```rb
# app/models/cart.rb
class Cart < ApplicationRecord
    has_many :line_items, dependent: :destroy
end
```
* Por fim, editar `app/models/product.rb`
```rb
# app/models/product.rb
class Product < ApplicationRecord
  has_many :line_items
  before_destroy :ensure_not_referenced_by_any_line_item

  ...

  private
  def ensure_not_referenced_by_any_line_item
    unless line_items.empty?
      errors.add(:base, 'Line Items present')
      throw :abort
    end
  end
end
```
* Modificar `config/routes.rb`
```rb
# config/routes.rb
Rails.application.routes.draw do
  resources :line_items, only: :create # MODIFY THIS LINE
  resources :carts, only: :show
  root to: "store#index"
  resources :products
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
```
* Editar o controlador `app/controllers/line_items_controller.rb`:
```ruby
# app/controllers/line_items_controller.rb
class LineItemsController < ApplicationController
  def create
    product = Product.find(params[:product_id])
    @line_item = @cart.line_items.build(product: product)

    respond_to do |format|
      if @line_item.save
        format.html { redirect_to @line_item.cart, notice: 'Item inserido com sucesso ao carrinho.' }
        format.json { render json: @line_item.cart, status: :created  }
      else
        format.html { render :new }
        format.json { render json: @line_item.errors, status: :unprocessable_entity }
      end
    end
  end
end  
```

### 2.2 Acrescentando um Botão
* Editar view `app/views/store/index.html.erb`:
```html
<!-- app/views/store/index.html.erb -->
...
        <!-- Price -->
        <p class="text-xl"><%= sprintf("R$%0.02f", product.price) %></p>

        <!-- Buy Button -->
        <%= button_to line_items_path(product_id: product), form_class: "w-full", class: 'btn cursor-pointer' do %>
          <i class="fas fa-shopping-basket text-2xl pr-3"></i><span class="text-sm">Comprar</span>
        <% end %>
        ...
```
* Vamos editar a view `app/views/carts/show.html.erb`
```html
<!-- app/views/carts/show.html.erb -->
<table class="table-fixed w-full m-4">
    <thead>
        <tr class="bg-gray-500 text-white text-base">
            <th class="py-2 w-1/2 ">Produto</th>
            <th class="py-2 w-2/12 text-left">Preço</th>
        </tr>
    </thead>
    <tbody>
        <% @cart.line_items.each do |line_item| %>
        <tr>
            <td class="py-4 flex items-center text-sm">
                <%= image_pack_tag line_item.product.photo_path, alt: line_item.product.title, class: 'h-12' %>
                <span class="pl-4"><%= line_item.product.title %></span>
            </td>
            <td class="py-4 text-sm"><%= sprintf("R$%0.02f", line_item.product.price) %></td>
        </tr>
        <% end %>
    </tbody>
</table>
```
* E habilitar o link de navegação na view `app/views/layouts/_navigation.html.erb`
```html
<!-- app/views/layouts/_navigation.html.erb -->
  ...
  <!-- Cart Icon -->
  <%= link_to @cart, class: 'flex hover:bg-transparent group md:order-last' do %> <!-- MODIFY THIS LINE -->
      <i class="fas fa-shopping-cart text-white text-xl group-hover:text-gray-300"></i>
      ...
  <% end %>  <!-- MODIFY THIS LINE -->
```

* Testar em <http://localhost:3000/> (deve ser possível adicionar items ao carrinho agora)

## Capítulo 3 - Um Carrinho Mais Esperto
* Executar:
```bash
rails generate migration add_quantity_to_line_items quantity:integer
```
* Editar `db/migrate/*_add_quantity_to_line_items.rb`
```rb
# db/migrate/*_add_quantity_to_line_items.rb
class AddQuantityToLineItems < ActiveRecord::Migration[6.0]
  def change
    add_column :line_items, :quantity, :integer, default: 1 # MODIFY THIS LINE
  end
end
```
* Executar:
```bash
rails db:migrate
```
* Edite o arquivo `app/models/line_item.rb`:
```rb
# app/models/line_item.rb
class LineItem < ApplicationRecord
  belongs_to :product
  belongs_to :cart

  def total_price # ADD THIS LINE
    product.price * quantity # ADD THIS LINE
  end # ADD THIS LINE
end
```
* Edite o arquivo `app/models/cart.rb`:
```rb
# app/models/cart.rb
class Cart < ApplicationRecord
  has_many :line_items, dependent: :destroy

  def add_product(product)
    current_item = line_items.find_by(product_id: product.id)
    if current_item
      current_item.quantity += 1
    else
      current_item = line_items.build(product_id: product.id)
    end
    current_item
  end

  def total_price
    line_items.to_a.sum { |item| item.total_price }
  end

  def total_items
      line_items.to_a.sum { |item| item.quantity }
  end
end
```
* Editar também o arquivo `app/controllers/line_items_controller.rb`:
```rb
# app/controllers/line_items_controller.rb
  ...

  def create
    product = Product.find(params[:product_id])
    @line_item = @cart.add_product(product) # MODIFY THIS LINE

  ...
```
* Agora, podemos atualizar a view `app/views/carts/show.html.erb`:
```html
<!-- app/views/carts/show.html.erb -->
      ...
      <th class="py-2 w-2/12 text-left">Preço</th>
      <th class="py-2 w-2/12 text-left">Quantidade</th> <!-- ADD THIS LINE -->
      <th class="py-2 w-2/12 text-left">Subtotal</th> <!-- ADD THIS LINE -->
      ...
      <td class="py-4 text-sm"><%= sprintf("R$%0.02f", line_item.product.price) %></td>
      <td class="py-4 text-sm"><%= line_item.quantity %></td> <!-- ADD THIS LINE -->
      <td class="py-4 text-sm"><%= sprintf("R$%0.02f", line_item.total_price) %></td> <!-- ADD THIS LINE -->
      ...
</table>
<!-- ADD BELOW -->
<div class="w-full flex justify-end">
    <div class="w-full md:max-w-md">
        <h2 class="text-3xl pb-2 mt-8">Total no carrinho</h2>
        <p class="text-sm py-4"><span class="font-bold mr-4 ">Total</span><%= sprintf("R$%0.02f", @cart.total_price) %>
        </p>
    </div>
</div>
```
* Por fim, vamos atualizar o ícone do carrinho. Edite a view `app/views/layouts/_navigation.html.erb`:
```html
<!-- app/views/layouts/_navigation.html.erb -->
        ...
        <!-- Cart Icon -->
        <%= link_to @cart, class: 'flex hover:bg-transparent group md:order-last' do %>
          <i class="fas fa-shopping-cart text-white text-xl group-hover:text-gray-300"></i>
          <span
              class="rounded-full w-4 h-4 -ml-1 -mt-2 self-start flex items-center justify-center bg-red-500 group-hover:bg-red-700 text-white group-hover:text-gray-300">
              <p><%= @cart.total_items %></p> <!-- MODIFY THIS LINE -->
          </span>
        <% end %>
        ...
```
* Para testar, vamos apagar todos os carrinhos e itens. Execute:
```bash
rails console
irb(main):001:0> LineItem.delete_all
irb(main):002:0> Cart.delete_all
irb(main):003:0> exit
```
* Testar em <http://localhost:3000/> (deve ser possível adicionar múltiplos itens iguais ao carrinho agora)

## Capítulo 4 - Utilizando AJAX

### 4.3 Realizando o Checkout
* Executar
```bash
rails generate scaffold Order name address:text email pay_type:integer
rails generate migration add_order_to_line_item order:references
```
* Editar `db/migrate/*_add_order_to_line_item.rb`:
```rb
# db/migrate/*_add_order_to_line_item.rb
class AddOrderToLineItem < ActiveRecord::Migration[6.0]
  def change
    add_reference :line_items, :order, null: true, foreign_key: true # MODIFY THIS LINE
    change_column :line_items, :cart_id, :integer, null: true # ADD THIS LINE
  end
end
```
* Executar
```bash
rails db:migrate
```
* Vamos atualizar os modelos. Editar `app/models/order.rb`
```rb
# app/models/order.rb
class Order < ApplicationRecord
  enum pay_type: {
    "Deposito"          => 0, 
    "Cartao de Credito" => 1, 
    "Boleto"            => 2
  }
  has_many :line_items, dependent: :destroy

  validates :name, :address, :email, presence: true
  validates :pay_type, inclusion: pay_types.keys

  def add_line_items_from_cart(cart)
    cart.line_items.each do |item|
      item.cart_id = nil
      line_items << item
    end
  end
end
```
* Editar `app/models/line_item.rb`
```rb
# app/models/line_item.rb
class LineItem < ApplicationRecord
    belongs_to :order, optional: true # ADD THIS LINE
    belongs_to :product
    belongs_to :cart, optional: true # MODIFY THIS LINE
    ...
```
* Editar controlador `app/controllers/orders_controller.rb`:
```rb
# app/controllers/orders_controller.rb
class OrdersController < ApplicationController
  before_action :ensure_cart_isnt_empty, only: :new # ADD THIS LINE
  before_action :set_order, only: [:show, :edit, :update, :destroy]
  ...
  def create
    @order = Order.new(order_params)
    @order.add_line_items_from_cart(@cart) # ADD THIS LINE

    respond_to do |format|
      if @order.save
        Cart.destroy(session[:cart_id]) # ADD THIS LINE
        session[:cart_id] = nil # ADD THIS LINE
        format.html { redirect_to root_path, notice: 'Obrigado pelo pedido.' } # MODIFY THIS LINE
        format.json { render :show, status: :created, location: @order }
  ...
  
  private

      ...

      # ADD BELOW
      def ensure_cart_isnt_empty
        if @cart.line_items.empty?
          redirect_to root_path, notice: 'Seu carrinho esta vazio'
        end
      end
end
```
* Agora vamos trabalhar na interface, edite a view `app/views/carts/show.html.erb`
```html
<!-- app/views/carts/show.html.erb -->
... 
<div class="w-full flex justify-end">
    <div class="w-full md:max-w-md">
        <h2 class="text-3xl pb-2 mt-8">Total no carrinho</h2>
        <p class="text-sm py-4"><span class="font-bold mr-4 ">Total</span><%= sprintf("R$%0.02f", @cart.total_price) %>
        </p>
        <%= button_to "Concluir Compra", new_order_path, method: :get, form_class: "w-full", class: 'btn text-lg cursor-pointer' %> <!-- ADD THIS LINE-->
    </div>
</div>
```
* Agora vamos editar as views do pedido. Primeiro edite `app/views/orders/new.html.erb`
```html
<!-- app/views/orders/new.html.erb -->
<section class="w-full lg:w-1/2 p-4">
    <h2 class="text-3xl mt-4 mb-8">Pagamento & Entrega</h2>
    <%= render 'form', order: @order %>
</section>
```
* Edite `app/views/orders/_form.html.erb`
```html
<!-- app/views/orders/_form.html.erb -->
<%= form_with(model: order, local: true) do |form| %>
  <% if order.errors.any? %>
    <div id="error_explanation">
      <h2><%= pluralize(order.errors.count, "error") %> prohibited this order from being saved:</h2>

      <ul>
        <% order.errors.full_messages.each do |message| %>
        <li><%= message %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <div class="my-4">
    <%= form.label :name, 'Nome', class: 'text-base mb-4' %>
    <%= form.text_field :name, size: 40, class: 'input' %>
  </div>

  <div class="my-4">
    <%= form.label :address, 'Endereço', class: 'text-base mb-4' %>
    <%= form.text_area :address, rows: 3, cols: 40, class: 'input' %>
  </div>

  <div class="my-4">
    <%= form.label :email, 'E-mail',  class: 'text-base mb-4' %>
    <%= form.email_field :email, size: 40, class: 'input' %>
  </div>

  <div x-data="{ paymode: '' }">
    <div class="my-4">
      <%= form.label :pay_type, 'Forma de Pagamento',  class: 'text-base mb-4' %>
      <%= form.select :pay_type, Order.pay_types.keys, {prompt: 'Escolha a forma de pagamento'}, {class: 'input',  'x-model'  => 'paymode' } %>
    </div>

    <div x-show="paymode == 'Deposito'" class="my-4">
      <%= form.label :banco, 'Banco de Origem' ,  class: 'text-base mb-4' %>
      <%= form.text_field :banco, size: 40, class: 'input' %>
    </div>

    <div x-show="paymode == 'Cartao de Credito'">
      <div class="my-4">
        <%= form.label :credit_card_number, 'Cartao de Credito' ,  class: 'text-base mb-4' %>
        <%= form.password_field :credit_card_number, class: 'input' %>
      </div>
      <div class="my-4">
        <%= form.label :expiration_date, 'Validade' ,  class: 'text-base mb-4' %>
        <%= form.text_field :expiration_date, size: 9, class: 'input' %>
      </div>
    </div>

    <div x-show="paymode == 'Boleto'" class="field my-4">
      <%= form.label :order_cpf, 'CPF' ,  class: 'text-base mb-4' %>
      <%= form.text_field :order_cpf, size: 40, class: 'input' %>
    </div>
  </div>

  <div class="w-full flex justify-end mt-8">
    <%= form.submit "Fazer Pedido", form_class: "w-full", class: 'btn text-lg cursor-pointer' %>
  </div>

<% end %>
```
* Testar em <http://localhost:3000> (deve ser possível fazer um pedido)
* Depois, verificar em <http://localhost:3000/orders> (deve mostrar o pedido criado)