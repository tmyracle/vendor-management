module Api::V1
  class W9sController < ApplicationController
    before_action :authorized
    before_action :set_w9, only: [:show, :update, :destroy]

    def create
      document = params[:document]
      w9 = W9.create!(w9_params.merge(uploaded_by: @user.id))
      w9.document.attach(document) if document.present? && !!w9
      render json: w9.as_json(methods: [:document_url, :document_name]), status: :ok
    end

    def update
      if params[:document].present?
        @w9.document.attach(params[:document]) if !!@w9
        render json: @w9.as_json(methods: [:document_url, :document_name]), status: :ok
      end
    end

    def show
      if params[:id].present?
        render json: @w9.as_json(methods: [:document_url, :document_name]), status: :ok
      else
        render json: {message: "Error rendering W9"}, status: :internal_server_error
      end
    end

    private 

    def set_w9
      @w9 = W9.find(params[:id])
    end

    def w9_params
      params.permit(:id, :policy_effective, :policy_expires, :document, :uploaded_by, :vendor_id)
    end
  end
  end
end
