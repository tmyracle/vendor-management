module Api::V1
  class CompaniesController < ApplicationController
    before_action :authorized
    before_action :set_company, only: [:show, :update, :destroy]

    def show
      render json: {company: @company.as_json(include: [users: {except: :password_digest, methods: [:status]}])}
    end

    private
      def set_company
        @company = Company.find(params[:id])
      end

      def company_params
        params.require(:name).permit(:id, :name)
      end 
  end
end
