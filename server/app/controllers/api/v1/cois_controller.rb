module Api::V1
  class CoisController < ApplicationController    
    before_action :authorized
    before_action :set_coi, only: [:show, :update, :destroy]

    def create
      document = params[:document]
      coi = Coi.create!(coi_params.merge(uploaded_by: @user.id))
      coi.document.attach(document) if document.present? && !!coi
      render json: coi.as_json(methods: [:document_url, :document_name]), status: :ok
    end

    def update
      if params[:document].present?
        @coi.document.attach(params[:document]) if !!@coi
        render json: @coi.as_json(methods: [:document_url, :document_name]), status: :ok
      end
    end

    def show
      if params[:id].present?
        render json: @coi.as_json(methods: [:document_url, :document_name]), status: :ok
      else
        render json: {message: "Error rendering COI"}, status: :internal_server_error
      end
    end

    private 

    def set_coi
      @coi = Coi.find(params[:id])
    end

    def coi_params
      params.permit(:id, :policy_effective, :policy_expires, :document, :uploaded_by, :vendor_id)
    end
  end

end