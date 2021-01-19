class CartsController < ApplicationController
  def show
    @cart = Cart.find(params[:id])
  end

  def current
  end
end