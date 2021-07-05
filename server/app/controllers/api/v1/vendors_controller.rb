module Api::V1
  class VendorsController < ApplicationController
    before_action :authorized

    def create
      if params[:name].present?
        vendor = Vendor.create!(name: params[:name], description: params[:description], website: params[:website], company_id: @user.companies[0].id)
        render json: vendor.as_json, status: :ok
      else
        render json: {message: "Problem adding new vendor. Make sure you provided a name."}, status: :internal_server_error
      end
    end


    def vendor_list
      if params[:query_term].present?
        vendors = Vendor.where(company_id: @user.companies.first.id).where("name ILIKE ?", "%#{params[:query_term]}%").order('lower(name) asc')
      else
        vendors = Vendor.where(company_id: @user.companies.first.id).order('lower(name) asc')
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