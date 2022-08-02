module Api::V1 
  class LineItemsController < ApplicationController
    before_action :authorized
    before_action :set_line_item, only: [:show, :update, :destroy]

    # GET /line_items
    def index
      @line_items = LineItem.where(company_id: @user.companies.first.id)

      render json: @line_items
    end

    # GET /line_items/1
    def show
      render json: @line_item
    end

    # POST /line_items
    def create
      @line_item = LineItem.new(line_item_params)
      @line_item.company_id = @user.companies.first.id

      if @line_item.save
        render json: @line_item, status: :created
      else
        render json: @line_item.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /line_items/1
    def update
      if @line_item.update(line_item_params)
        render json: @line_item
      else
        render json: @line_item.errors, status: :unprocessable_entity
      end
    end

    # DELETE /line_items/1
    def destroy
      @line_item.destroy
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_line_item
        @line_item = LineItem.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def line_item_params
        params.require(:line_item).permit(:description, :unit_price, :unit, :references, :identifier)
      end
  end
end
