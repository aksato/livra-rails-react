class LineItemsController < ApplicationController
    def create
        product = Product.find(params[:product_id])
        @line_item = @cart.add_product(product)

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