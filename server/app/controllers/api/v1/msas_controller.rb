module Api::V1 
  class MsasController < ApplicationController
    before_action :authorized
    before_action :set_msa, only: [:show, :update, :destroy]

    def create
      document = params[:document]
      msa = Msa.create!(msa_params.merge(uploaded_by: @user.id))
      msa.document.attach(document) if document.present? && !!msa
      render json: msa.as_json(methods: [:document_url, :document_name]), status: :ok
    end

    def update
      if params[:document].present?
        @msa.document.attach(params[:document]) if !!@msa
        render json: @msa.as_json(methods: [:document_url, :document_name]), status: :ok
      end
    end

    def show
      if params[:id].present?
        render json: @msa.as_json(methods: [:document_url, :document_name]), status: :ok
      else
        render json: {message: "Error rendering MSA"}, status: :internal_server_error
      end
    end

    private 

    def set_msa
      @msa = Msa.find(params[:id])
    end

    def msa_params
      params.permit(:id, :status, :document, :executed_on, :uploaded_by, :vendor_id)
    end
  end
end