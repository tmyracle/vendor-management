module Api::V1
  class VendorsController < ApplicationController
    before_action :authorized

    private
      def vendor_params
        params.require(:name).permit(:id, :name, :description, :website)
      end 
  end
end
