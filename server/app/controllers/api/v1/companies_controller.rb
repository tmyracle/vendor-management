module Api::V1
  class CompaniesController < ApplicationController
    before_action :authorized
    before_action :set_company, only: [:show, :update, :destroy]

    def show
      render json: {company: @company.as_json(include: [users: {except: :password_digest, methods: [:status]}])}
    end

    def create
      logo = params[:logo]
      company = Company.create!(name: params[:name])
      company.logo.attach(logo) if logo.present? && !!company
      render json: company.as_json(methods: :logo_url), status: :ok
    end

    def update
      if params[:logo].present?
        @company.logo.attach(params[:logo]) if !!@company
        render json: @company.as_json(methods: :logo_url), status: :ok
      end
    end

    private
      def set_company
        @company = Company.find(params[:id])
      end

      def company_params
        params.require(:name).permit(:id, :name, :logo)
      end 
  end
end
