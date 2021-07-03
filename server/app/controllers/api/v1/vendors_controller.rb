module Api::V1
  class VendorsController < ApplicationController
    before_action :authorized

    def vendor_list
      if params[:query_term].present?
        vendors = Vendor.where(company_id: @user.companies.first.id).where("name ILIKE ?", "%#{params[:query_term]}%").order(name: 'asc')
      else
        vendors = Vendor.where(company_id: @user.companies.first.id).order(name: 'asc')
      end

      results = Hash.new
      vendors.each do |vendor|
        first_letter = vendor.name[0].upcase
        if results.has_key?(first_letter)
          results[first_letter].append(vendor)
        else
          results[first_letter] = [vendor]
        end
      end
      render json: results.as_json
    end


    private
      def vendor_params
        params.require(:name).permit(:id, :name, :description, :website)
      end 
  end
end
