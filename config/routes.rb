Rails.application.routes.draw do
  resources :orders
  resources :line_items, only: :create
  get 'carts/current'
  resources :carts, only: :show
  root to: "store#index"
  resources :products

  get 'blog', to: 'store#index'
  get 'perguntas', to: 'store#index'
  get 'noticias', to: 'store#index'
  get 'contato', to: 'store#index'
  get 'books/:id', to: 'store#index'
  get 'cart', to: 'store#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
