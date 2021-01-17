Rails.application.routes.draw do
  resources :orders
  resources :line_items, only: :create
  resources :carts, only: :show
  root to: "store#index"
  resources :products

  get 'blog', to: 'store#index'
  get 'perguntas', to: 'store#index'
  get 'noticias', to: 'store#index'
  get 'contato', to: 'store#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
