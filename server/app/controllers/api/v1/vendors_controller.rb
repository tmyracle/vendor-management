module Api::V1
  class VendorsController < ApplicationController
    before_action :authorized

    def create
      if params[:name].present?
        vendor = Vendor.create!(name: params[:name], description: params[:description], website: params[:website], company_id: @user.companies[0].id)
        render json: vendor.as_json(include: [:contacts, 
          {msas: {methods: [:document_url, :document_name, :uploader]}},
          {cois: {methods: [:document_url, :document_name, :uploader]}},
          {w9s: {methods: [:document_url, :document_name, :uploader]}}
          ], methods: [:msa_compliant, :coi_compliant, :w9_compliant]), status: :ok
      else
        render json: {message: "Problem adding new vendor. Make sure you provided a name."}, status: :internal_server_error
      end
    end

    def update
      if params[:id].present?
        vendor = Vendor.find(params[:id])
        vendor.update(update_params)
        render json: vendor.as_json(include: [:contacts, 
          {msas: {methods: [:document_url, :document_name, :uploader]}},
          {cois: {methods: [:document_url, :document_name, :uploader]}},
          {w9s: {methods: [:document_url, :document_name, :uploader]}}
          ], methods: [:msa_compliant, :coi_compliant, :w9_compliant]), status: :ok
      else
        render json: {message: "Something went wrong updating the vendor"}, status: :internal_server_error
      end
    end

    def show
      if params[:id].present?
        vendor = Vendor.find(params[:id])
        render json: vendor.as_json(include: [:contacts, 
          {msas: {methods: [:document_url, :document_name, :uploader]}},
          {cois: {methods: [:document_url, :document_name, :uploader]}},
          {w9s: {methods: [:document_url, :document_name, :uploader]}},
          ], methods: [:msa_compliant, :coi_compliant, :w9_compliant]), status: :ok
      else
        render json: {message: "No vendor id provided."}, status: :internal_server_error
      end
    end

    def destroy
      vendor = Vendor.find(params[:id])
      if vendor.present?
        vendor.destroy
        render status: :ok
      else
        render json: {message: "Error deleting vendor."}, status: :internal_server_error
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
        params.require(:name).permit(:id, :name, :description, :website, :msa_required, :coi_required, :w9_required)
      end 

      def update_params
        params.permit(:id, :name, :description, :website, :msa_required, :coi_required, :w9_required).select { |k, v| !v.nil? }
      end
  end
end
