module Api::V1
  class W9sController < ApplicationController
    before_action :authorized
    before_action :set_w9, only: [:show, :update, :destroy]

    def create
      document = params[:document]
      w9 = W9.create!(w9_params.merge(uploaded_by: @user.id))
      w9.document.attach(document) if document.present? && !!w9
      render json: w9, status: :ok
    end

    def update
      if params[:remove_file].present? && params[:remove_file]
        @w9.document.attachment.purge
        @w9.document.purge
      end

      if params[:document].present?
        @w9.document.attach(params[:document]) if !!@w9
        @w9.update(update_params)
        render json: @w9, status: :ok
      else
        @w9.update(update_params)
        render json: @w9, status: :ok
      end
    end

    def show
      if params[:id].present?
        render json: @w9, status: :ok
      else
        render json: {message: "Error rendering W9"}, status: :internal_server_error
      end
    end

    def destroy
      if params[:id].present?
        @w9.destroy
        render status: :ok
      else
        render json: {message: "There was a problem deleting the W9"}, status: :internal_server_error
      end
    end

    private 

    def set_w9
      @w9 = W9.find(params[:id])
    end

    def w9_params
      params.permit(:id, :taxpayer_id_number, :executed_on, :document, :uploaded_by, :vendor_id)
    end

    def update_params
      params.permit(:id, :taxpayer_id_number, :executed_on, :document, :uploaded_by, :vendor_id).select { |k,v| !v.nil? }
    end

  end
end
